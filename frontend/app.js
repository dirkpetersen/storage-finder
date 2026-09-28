const ICONS = {
  building: '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1M14 9h1M9 13h1M14 13h1M10 21v-4h4v4"/>',
  cog: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9L7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M12 8v5M12 16v.5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c.8-3.5 3.5-5.5 7-5.5s6.2 2 7 5.5M16 4.8a3.5 3.5 0 010 6.4M18 14.8c2 .6 3.4 2.4 4 5.2"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
  folder: '<path d="M3 6h6l2 2h10v11H3z"/>',
  drive: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  server: '<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><path d="M7 7h.01M7 17h.01"/>',
  lifering: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M5.6 5.6l3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9"/>',
  flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  archive: '<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v12h14V8M10 12h4"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  print: '<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
};

function icon(name) {
  return `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;
}

const state = { step: 0, answers: {}, editing: false, classifications: null, steps: [] };

function buildSteps() {
  const cls = state.classifications;
  return [
    {
      key: "department",
      label: "Where",
      title: "Where do you work?",
      sub: "College of Engineering staff and students have a few extra storage services to choose from.",
      options: [
        { value: "general", icon: "building", title: "General university", chip: "General university", desc: "Show services open to everyone at the university." },
        { value: "engineering", icon: "cog", title: "College of Engineering", chip: "College of Engineering", desc: "Include engineering-only home, project, and archive space." },
      ],
    },
    {
      key: "classification",
      label: "Data",
      title: "How sensitive is your data?",
      sub: "Choose the university data classification. If you are torn between two, pick the more restrictive one.",
      options: ["unrestricted", "sensitive", "confidential"].map((k) => ({
        value: k,
        icon: k === "unrestricted" ? "globe" : k === "sensitive" ? "lock" : "shield",
        title: cls[k].label,
        chip: `${cls[k].label} data`,
        desc: cls[k].summary,
        examples: cls[k].examples.slice(0, 3),
      })),
    },
    {
      key: "audience",
      label: "Who",
      title: "Who needs access?",
      sub: "Think about everyone who will open, edit, or download these files.",
      options: [
        { value: "individual", icon: "user", title: "Just me", chip: "Just me", desc: "Only I use these files." },
        { value: "team", icon: "users", title: "My team", chip: "My team", desc: "A group inside the university shares them." },
        { value: "external", icon: "share", title: "People outside the university", chip: "External collaborators", desc: "Partners, sponsors, or collaborators without a university login." },
      ],
    },
    {
      key: "volume",
      label: "Size",
      title: "How much data is it?",
      sub: "A rough guess is fine. You can change your answer later.",
      options: [
        { value: "small", icon: "file", title: "Under 25 GB", chip: "Under 25 GB", desc: "Documents, spreadsheets, and small datasets." },
        { value: "medium", icon: "folder", title: "25 GB to 1 TB", chip: "25 GB to 1 TB", desc: "A large project or a personal archive." },
        { value: "large", icon: "drive", title: "1 TB to 5 TB", chip: "1 TB to 5 TB", desc: "Big datasets, imaging, or media collections." },
        { value: "xlarge", icon: "server", title: "More than 5 TB", chip: "Over 5 TB", desc: "Large-scale research data." },
      ],
    },
    {
      key: "backup",
      label: "Backup",
      title: "Should it be backed up?",
      sub: "Ask yourself: what happens if the only copy disappears?",
      options: [
        { value: "auto", icon: "lifering", title: "Yes, back it up", chip: "Backup needed", desc: "It would be hard or impossible to replace." },
        { value: "none", icon: "flask", title: "No, it is temporary", chip: "No backup needed", desc: "Scratch space, or data I can easily regenerate." },
      ],
    },
    {
      key: "purpose",
      label: "Use",
      title: "What will you do with it?",
      sub: "This lets us match speed and cost to your work.",
      options: [
        { value: "everyday", icon: "folder", title: "Everyday files", chip: "Everyday files", desc: "Documents, presentations, and day-to-day work." },
        { value: "hpc", icon: "bolt", title: "Active research computing", chip: "Research computing", desc: "Data used by compute jobs and analysis pipelines." },
        { value: "archive", icon: "archive", title: "Long-term archive", chip: "Long-term archive", desc: "Data I must keep but rarely open." },
      ],
    },
  ];
}

const $ = (id) => document.getElementById(id);

async function init() {
  state.classifications = await (await fetch("/api/classifications")).json();
  state.steps = buildSteps();
  $("brandMark").innerHTML = icon("layers");
  $("compareToggle").addEventListener("click", toggleCompare);
  $("compareTop").addEventListener("click", (e) => {
    e.preventDefault();
    if ($("compareWrap").hidden) toggleCompare();
    $("compare").scrollIntoView({ behavior: "smooth" });
  });
  document.addEventListener("keydown", onKey);

  const fromHash = Object.fromEntries(new URLSearchParams(location.hash.slice(1)));
  if (state.steps.every((s) => s.options.some((o) => o.value === fromHash[s.key]))) {
    state.answers = fromHash;
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
      return `<li class="${cls}${now}"><button type="button" ${clickable ? `data-go="${i}"` : "tabindex='-1'"} ${i === state.step ? 'aria-current="step"' : ""}>
        <span class="dot">${cls === "done" && !now ? icon("check") : i + 1}</span><span class="lbl">${s.label}</span></button></li>`;
    })
    .join("")}</ol>`;
}

function renderStep() {
  $("results").hidden = true;
  const step = state.steps[state.step];
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
            <button type="button" class="tile${o.value === selected ? " sel" : ""}" aria-pressed="${o.value === selected}" data-value="${o.value}">
              <span class="key" aria-hidden="true">${n + 1}</span>
              <span class="ico">${icon(o.icon)}</span>
              <span class="t">${o.title}</span>
              <span class="d">${o.desc}</span>
              ${o.examples ? `<span class="eg">For example: ${o.examples.join(", ")}</span>` : ""}
            </button>`
            )
            .join("")}
        </div>
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
  setTimeout(advance, 260);
}

function advance() {
  if (!state.answers[state.steps[state.step].key]) return;
  if (state.editing || state.step === state.steps.length - 1) return showResults();
  state.step += 1;
  state.focusTitle = true;
  renderStep();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function onKey(e) {
  if (!$("results").hidden || e.metaKey || e.ctrlKey || e.altKey) return;
  const n = Number(e.key);
  const step = state.steps[state.step];
  if (n >= 1 && n <= step.options.length && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
    choose(step.options[n - 1].value);
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
  const limit = state.answers.department === "general" ? ` or ${many ? "are" : "is"} limited to engineering` : "";
  return `<p class="excluded">${n} service${many ? "s were" : " was"} left out because ${many ? "they aren't" : "it isn't"} available for ${state.answers.classification} data${limit}.</p>`;
}

async function showResults() {
  const res = await fetch("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state.answers),
  });
  const data = await res.json();
  history.replaceState(null, "", "#" + new URLSearchParams(state.answers).toString());

  $("wizard").innerHTML = "";
  const box = $("results");
  box.hidden = false;

  const [best, ...rest] = data.recommendations;
  const shown = rest.slice(0, 4);
  const hidden = rest.slice(4);

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
        <p>Ranked from ${data.recommendations.length} services that fit your answers. Click a chip to change an answer.</p>
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
        <th>Capacity</th><th>Cost</th><th>Backup</th><th>Available to</th>
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
        <td>${o.department_restricted ? "Engineering only" : "Everyone"}</td>
      </tr>`
        )
        .join("")}</tbody>
    </table>`;
}

init();
