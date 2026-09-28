const state = { step: 0, answers: {}, editing: false, classifications: null, steps: [], token: 0, timer: null, avail: null };


async function init() {
  state.classifications = await api("/api/classifications");
  state.steps = buildSteps(state.classifications);
  $("brandMark").innerHTML = icon("layers");
  $("compareToggle").addEventListener("click", toggleCompare);
  initMatrix();
  document.addEventListener("keydown", onKey);

  const fromHash = Object.fromEntries(new URLSearchParams(location.hash.slice(1)));
  if (state.steps.every((s) => s.options.some((o) => o.value === fromHash[s.key]))) {
    state.answers = Object.fromEntries(state.steps.map((s) => [s.key, fromHash[s.key]]));
    await showResults();
  } else {
    renderStep();
  }
}

function renderStepper() {
  return `<ol class="stepper">${state.steps
    .map((s, i) => {
      const cls = state.answers[s.key] ? "done" : "";
      const now = i === state.step ? " now" : "";
      const clickable = cls === "done";
      return `<li class="${cls}${now}"><button type="button" aria-label="Step ${i + 1}: ${s.label}" ${clickable ? `data-go="${i}"` : "disabled"} ${i === state.step ? 'aria-current="step"' : ""}>
        <span class="dot">${cls === "done" && !now ? icon("check") : i + 1}</span><span class="lbl">${s.label}</span></button></li>`;
    })
    .join("")}</ol>`;
}

async function renderStep() {
  $("results").hidden = true;
  const token = ++state.token;
  const step = state.steps[state.step];
  const avail = (await api("/api/filter", state.answers)).availability[step.key];
  if (token !== state.token) return;
  if (state.answers[step.key] && avail[state.answers[step.key]] === 0) delete state.answers[step.key];
  state.avail = avail;
  const selected = state.answers[step.key];
  const last = state.step === state.steps.length - 1;

  const allExamples = step.key === "classification"
    ? `<details class="eg-all"><summary>See full examples for each level</summary><div class="cols">${["unrestricted", "sensitive", "confidential"]
        .map((k) => `<div><h4>${state.classifications[k].label}</h4><ul>${state.classifications[k].examples.map((e) => `<li>${e}</li>`).join("")}</ul></div>`)
        .join("")}</div></details>`
    : "";

  $("wizard").innerHTML = `
    <div class="panel">
      ${renderStepper()}
      <div class="q">
        <h2 tabindex="-1" id="qTitle">${step.title}</h2>
        <p class="sub">${step.sub}</p>
        <div class="tiles">
          ${step.options
            .map(
              (o, n) => `
            <button type="button" class="tile${o.value === selected ? " sel" : ""}" aria-pressed="${o.value === selected}" data-value="${o.value}"
              ${avail[o.value] === 0 ? 'disabled title="No storage service fits this together with your other answers."' : ""}>
              <span class="key" aria-hidden="true">${n + 1}</span>
              <span class="ico">${icon(o.icon)}</span>
              <span class="t">${o.title}</span>
              <span class="d">${o.desc}</span>
              ${o.examples ? `<span class="eg">For example: ${o.examples.join(", ")}</span>` : ""}
            </button>`
            )
            .join("")}
        </div>
        ${step.key === "classification" ? `<p class="callout">${icon("info")}<span>${state.classifications.unrestricted.note}</span></p>` : ""}
        ${allExamples}
        <div class="q-foot">
          <button type="button" class="btn btn-quiet" id="backBtn" ${state.step === 0 ? "disabled" : ""}>Back</button>
          <span class="hint">Click an answer to continue. Keys 1 to ${step.options.length} also work.</span>
          ${selected ? `<button type="button" class="btn btn-primary" id="nextBtn">${last || state.editing ? "See recommendations" : "Continue"}</button>` : ""}
        </div>
      </div>
    </div>`;

  $("wizard").querySelectorAll(".tile").forEach((t) => t.addEventListener("click", () => choose(t.dataset.value)));
  $("wizard").querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => goTo(Number(b.dataset.go))));
  $("backBtn").addEventListener("click", () => goTo(state.step - 1));
  const next = $("nextBtn");
  if (next) next.addEventListener("click", advance);
  if (state.focusTitle) { $("qTitle").focus({ preventScroll: true }); state.focusTitle = false; }
}

function goTo(i) {
  clearTimeout(state.timer);
  state.step = Math.max(0, i);
  state.focusTitle = true;
  renderStep();
}

function choose(value) {
  const step = state.steps[state.step];
  state.answers[step.key] = value;
  document.querySelectorAll(".tile").forEach((t) => {
    const on = t.dataset.value === value;
    t.classList.toggle("sel", on);
    t.setAttribute("aria-pressed", on);
  });
  clearTimeout(state.timer);
  state.timer = setTimeout(advance, 260);
}

function advance() {
  clearTimeout(state.timer);
  if (!state.answers[state.steps[state.step].key]) return;
  if (state.editing || state.step === state.steps.length - 1) return showResults();
  state.step += 1;
  state.focusTitle = true;
  renderStep();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function onKey(e) {
  if (!state.avail || !state.steps.length || !$("results").hidden || e.metaKey || e.ctrlKey || e.altKey) return;
  const n = Number(e.key);
  const step = state.steps[state.step];
  const opt = step.options[n - 1];
  if (opt && state.avail[opt.value] !== 0 && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
    choose(opt.value);
  }
}

function ring(score, size, tone) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - score / 100);
  return `<svg class="ring ${tone}" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${score} percent match">
    <circle class="track" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="8"/>
    <circle class="bar" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="8" stroke-linecap="round"
      style="--c:${c.toFixed(1)};--off:${off.toFixed(1)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-size="${size * 0.22}">${score}%</text>
  </svg>`;
}

const reasonsHtml = (r) => `<ul class="why">${r.map((x) => `<li>${icon("check")}<span>${x}</span></li>`).join("")}</ul>`;
const notesHtml = (w) => (w.length ? `<ul class="notes">${w.map((x) => `<li>${icon("alert")}<span>${x}</span></li>`).join("")}</ul>` : "");

function topPick(rec, tied) {
  const o = rec.option;
  return `
  <article class="top-pick on-dark">
    <div>${ring(rec.score, 132, "")}</div>
    <div>
      <span class="badge">${icon("star")} ${tied ? "Tied for best" : "Best match"}</span>
      <h3>${o.name}</h3>
      ${o.vendor !== "—" ? `<div class="vendor">Powered by ${o.vendor}</div>` : `<div class="vendor">${o.category}</div>`}
      <p class="tag-line">${o.tagline}</p>
      <dl class="facts">
        <div><dt>Cost</dt><dd>${o.cost}</dd></div>
        <div><dt>Capacity</dt><dd>${o.capacity_label}</dd></div>
        <div><dt>Backup</dt><dd>${o.backup_note}</dd></div>
      </dl>
      ${reasonsHtml(rec.reasons)}
      ${notesHtml(rec.warnings)}
    </div>
  </article>`;
}

function altCard(rec) {
  const o = rec.option;
  const free = /^(free|none)/i.test(o.cost);
  return `
  <article class="alt">
    <div>${ring(rec.score, 76, "")}</div>
    <div>
      <h4>${o.name}</h4>
      <div class="vendor">${o.vendor !== "—" ? `${o.vendor} · ` : ""}${o.category}</div>
      <p>${o.tagline}</p>
      <div class="meta-line"><span class="${free ? "free" : ""}">${o.cost}</span><span>${o.capacity_label}</span></div>
      ${notesHtml(rec.warnings)}
    </div>
    <details>
      <summary>Why this score, pros and cons</summary>
      ${reasonsHtml(rec.reasons)}
      <p>${o.description}</p>
      <div class="pc">
        <div><h5>Pros</h5><ul>${o.pros.map((p) => `<li>${p}</li>`).join("")}</ul></div>
        <div><h5>Cons</h5><ul>${o.cons.map((c) => `<li>${c}</li>`).join("")}</ul></div>
      </div>
    </details>
  </article>`;
}

function excludedNote(n) {
  if (!n) return "";
  const many = n > 1;
  const limit = state.answers.cost === "either" ? "" : " or your pricing choice";
  return `<p class="excluded">${n} service${many ? "s were" : " was"} left out because ${many ? "they aren't" : "it isn't"} available for ${state.answers.classification} data${limit}.</p>`;
}

async function showResults() {
  clearTimeout(state.timer);
  state.token++;
  const data = await api("/api/recommend", state.answers);
  history.replaceState(null, "", "#" + new URLSearchParams(state.answers).toString());

  $("wizard").innerHTML = "";
  const box = $("results");
  box.hidden = false;

  if (!data.recommendations.length) {
    box.innerHTML = `<div class="panel"><div class="res-head"><h2>No services match these answers</h2><p>Start over and try different answers.</p><button type="button" class="btn btn-line" id="restartBtn">Start over</button></div></div>`;
    $("restartBtn").addEventListener("click", () => { state.answers = {}; state.step = 0; history.replaceState(null, "", location.pathname); renderStep(); });
    return;
  }
  const [best, ...rest] = data.recommendations;
  const shown = rest.slice(0, 6);
  const hidden = rest.slice(6);

  const chips = state.steps
    .map((s, i) => {
      const o = s.options.find((x) => x.value === state.answers[s.key]);
      return `<button type="button" class="chip" data-edit="${i}" title="Change this answer">${icon(o.icon)}${o.chip}</button>`;
    })
    .join("");

  box.innerHTML = `
    <div class="panel">
      <div class="res-head">
        <h2>Your best storage match: ${best.option.name}</h2>
        <p>${data.recommendations.length} services ranked from best to weakest fit; warnings show where a service falls short. Click a chip to change an answer.</p>
        <div class="chips">${chips}</div>
        <div class="res-actions">
          <button type="button" class="btn btn-line" id="restartBtn">Start over</button>
          <button type="button" class="btn btn-line" id="printBtn">${icon("print")} Print or save as PDF</button>
        </div>
      </div>
      ${topPick(best, rest[0] && rest[0].score === best.score)}
      ${shown.length ? `<div class="alts-head"><h3>Other good options</h3></div><div class="alts">${shown.map(altCard).join("")}</div>` : ""}
      ${hidden.length ? `<div class="more"><button type="button" class="btn btn-quiet" id="moreBtn">Show ${hidden.length} more</button></div><div class="alts" id="moreAlts" hidden>${hidden.map(altCard).join("")}</div>` : ""}
      ${excludedNote(data.excluded_count)}
    </div>`;

  box.querySelectorAll("[data-edit]").forEach((b) =>
    b.addEventListener("click", () => {
      state.editing = true;
      state.step = Number(b.dataset.edit);
      history.replaceState(null, "", location.pathname);
      renderStep();
      window.scrollTo({ top: 0, behavior: "smooth" });
    })
  );
  $("restartBtn").addEventListener("click", () => {
    state.answers = {};
    state.step = 0;
    state.editing = false;
    history.replaceState(null, "", location.pathname);
    renderStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  $("printBtn").addEventListener("click", () => window.print());
  const more = $("moreBtn");
  if (more) more.addEventListener("click", () => { $("moreAlts").hidden = false; more.parentElement.hidden = true; });
  state.editing = false;
  $("results").querySelector("h2").setAttribute("tabindex", "-1");
  $("results").querySelector("h2").focus({ preventScroll: true });
}

let compareLoaded = false;
async function toggleCompare() {
  const wrap = $("compareWrap");
  const btn = $("compareToggle");
  wrap.hidden = !wrap.hidden;
  btn.textContent = wrap.hidden ? "Show table" : "Hide table";
  btn.setAttribute("aria-expanded", String(!wrap.hidden));
  if (wrap.hidden || compareLoaded) return;
  compareLoaded = true;

  const options = await (await fetch("/api/options")).json();
  const st = {
    ok: `<span class="st st-ok">${icon("check")} Yes</span>`,
    review: `<span class="st st-review">${icon("alert")} Needs review</span>`,
    no: `<span class="st st-no">No</span>`,
  };
  wrap.innerHTML = `
    <table class="cmp">
      <thead><tr>
        <th>Service</th><th>Predominant technology / vendor</th><th>Unrestricted</th><th>Sensitive</th><th>Confidential</th>
        <th>Capacity</th><th>Cost</th><th>Backup</th>
      </tr></thead>
      <tbody>${options
        .map(
          (o) => `<tr>
        <th scope="row">${o.short_name}<small>${o.category}</small></th>
        <td>${o.vendor}</td>
        <td>${st[o.classification_status.unrestricted]}</td>
        <td>${st[o.classification_status.sensitive]}</td>
        <td>${st[o.classification_status.confidential]}</td>
        <td>${o.capacity_label}</td>
        <td>${o.cost}</td>
        <td>${o.backup_available ? "Yes" : "No"}</td>
      </tr>`
        )
        .join("")}</tbody>
    </table>`;
}

init();
