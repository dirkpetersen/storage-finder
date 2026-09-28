const state = { answers: {}, steps: [], classifications: null, matches: [], availability: {} };

const LABELS = {
  audiences: { individual: "Just you", team: "Your team", external: "Outside collaborators" },
  volumes: { small: "Under 25 GB", medium: "25 GB to 1 TB", large: "1 TB to 5 TB", xlarge: "Over 5 TB" },
  purposes: { everyday: "Everyday files", hpc: "Research computing", archive: "Long-term archive" },
};

async function init() {
  $("brandMark").innerHTML = icon("layers");
  $("printBtn").innerHTML = `${icon("print")} Print`;
  state.classifications = await api("/api/classifications");
  state.steps = buildSteps(state.classifications);
  const fromHash = Object.fromEntries(new URLSearchParams(location.hash.slice(1)));
  for (const s of state.steps) if (s.options.some((o) => o.value === fromHash[s.key])) state.answers[s.key] = fromHash[s.key];

  $("hideApps").addEventListener("change", renderGrid);
  $("clearBtn").addEventListener("click", () => { state.answers = {}; refresh(); });
  $("printBtn").addEventListener("click", () => window.print());
  initMatrix();
  await refresh();
}

async function refresh() {
  const data = await api("/api/filter", state.answers);
  state.matches = data.matches;
  state.availability = data.availability;
  history.replaceState(null, "", location.pathname + (Object.keys(state.answers).length ? "#" + new URLSearchParams(state.answers) : ""));
  renderPicks();
  renderGrid();
}

function renderPicks() {
  $("picks").innerHTML = state.steps
    .map(
      (s) => `
    <fieldset class="group">
      <legend>${s.title}</legend>
      <div class="pick-row">
        ${s.options
          .filter((o) => !o.wizardOnly)
          .map((o) => {
            const n = state.availability[s.key][o.value];
            const on = state.answers[s.key] === o.value;
            return `<button type="button" class="pick" data-key="${s.key}" data-value="${o.value}" aria-pressed="${on}" aria-label="${o.chip}, ${n} services"
              ${n === 0 && !on ? 'disabled title="No storage service fits this together with your other choices."' : `title="${o.desc}"`}>
              <span class="ico">${icon(o.icon)}</span>${o.chip}<span class="n" aria-hidden="true">${n}</span></button>`;
          })
          .join("")}
      </div>
      ${s.key === "classification" ? `<p class="callout">${icon("info")}<span>${state.classifications.unrestricted.note}</span></p>` : ""}
    </fieldset>`
    )
    .join("");
  document.querySelectorAll(".pick").forEach((b) =>
    b.addEventListener("click", () => {
      const { key, value } = b.dataset;
      if (state.answers[key] === value) delete state.answers[key];
      else state.answers[key] = value;
      refresh();
    })
  );
}

const list = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
const opts = (o, field, labels, key) =>
  o[field].map((v) => `<span class="opt${state.answers[key] === v ? " sel" : ""}">${labels[v]}</span>`).join(", ");

function renderGrid() {
  const hide = $("hideApps").checked;
  const cols = state.matches.filter((o) => !(hide && o.kind === "application"));
  const hiddenN = state.matches.length - cols.length;
  const picked = Object.keys(state.answers).length;

  $("count").innerHTML = `${cols.length} service${cols.length === 1 ? "" : "s"} ${picked ? "match" : "in total"}<small>${
    picked ? `Based on ${picked} choice${picked === 1 ? "" : "s"}. Click a chosen tile again to remove it.` : "Choose tiles above to narrow the list."
  }${hiddenN ? ` ${hiddenN} specialized tool${hiddenN === 1 ? " is" : "s are"} hidden.` : ""}</small>`;

  if (!cols.length) {
    $("grid").innerHTML = `<div class="empty"><strong>No service fits all of these choices.</strong>Remove one choice to see more options.</div>`;
    return;
  }

  const A = state.answers;
  const rows = [
    ["Best for", (o) => `<span class="strong">${o.tagline}</span>${o.specialty ? `<span class="sub">${o.specialty}</span>` : ""}`],
    ["Technology / vendor", (o) => (o.vendor === "—" ? "Not specified" : o.vendor)],
    ["Cost", (o) => `<span class="strong">${o.cost}</span><span class="sub">${pricingLabel(o)}</span>`, "cost", !!A.cost],
    ["Capacity", (o) => o.capacity_label],
    ["Backup", (o) => `<span class="strong">${o.backup_available ? "Yes" : "No"}</span><span class="sub">${o.backup_note}</span>`, "backup", A.backup === "auto"],
    ["Unrestricted data", (o) => statusHtml(o.classification_status.unrestricted), "classification", A.classification === "unrestricted"],
    ["Sensitive data", (o) => statusHtml(o.classification_status.sensitive), "classification", A.classification === "sensitive"],
    ["Confidential data", (o) => statusHtml(o.classification_status.confidential), "classification", A.classification === "confidential"],
    ["Works for", (o) => opts(o, "audiences", LABELS.audiences, "audience"), "audience", !!A.audience],
    ["Data size", (o) => opts(o, "volumes", LABELS.volumes, "volume"), "volume", !!A.volume],
    ["Good for", (o) => opts(o, "purposes", LABELS.purposes, "purpose"), "purpose", !!A.purpose],
    ["Pros", (o) => list(o.pros)],
    ["Cons", (o) => list(o.cons)],
  ];

  $("grid").innerHTML = `<table class="grid">
    <thead><tr><th scope="col"><span class="sr">Attribute</span></th>${cols
      .map((o) => `<th scope="col">${o.name}<small>${o.category}</small>${o.kind === "application" ? '<span class="spec">Specialized tool</span>' : ""}</th>`)
      .join("")}</tr></thead>
    <tbody>${rows
      .map(([label, fn, , hl]) => `<tr class="${hl ? "hl" : ""}"><th scope="row" class="rl">${label}</th>${cols.map((o) => `<td>${fn(o)}</td>`).join("")}</tr>`)
      .join("")}</tbody></table>`;
}

init();
