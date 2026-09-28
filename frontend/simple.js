const CATEGORY_ICON = {
  "Cloud file sharing": "globe",
  "University-managed research storage": "server",
  "University-managed file storage": "drive",
  "Purchasable cloud storage": "layers",
  "Messaging and chat": "users",
  "Research application": "flask",
  "Records management": "archive",
  "Learning management": "file",
  "Not recommended for permanent storage": "alert",
};
const AUD = { individual: "Just you", team: "Your team", external: "Outside collaborators" };
const VOL = { small: "Under 25 GB", medium: "25 GB to 1 TB", large: "1 TB to 5 TB", xlarge: "Over 5 TB" };
const USE = { everyday: "Everyday files", hpc: "Research computing", archive: "Long-term archive" };

const FILTERS = [
  { id: "free", label: "Free within a quota", test: (o) => o.pricing !== "paid" },
  { id: "paid", label: "Paid capacity", test: (o) => o.pricing !== "quota" },
  { id: "backup", label: "Backup included", test: (o) => o.backup_available },
  { id: "conf", label: "Can hold confidential data", test: (o) => o.classification_status.confidential !== "no" },
  { id: "ext", label: "Share outside the university", test: (o) => o.audiences.includes("external") },
  { id: "big", label: "Large data (1 TB and up)", test: (o) => o.volumes.includes("large") || o.volumes.includes("xlarge") },
  { id: "hpc", label: "Research computing", test: (o) => o.purposes.includes("hpc") },
  { id: "arc", label: "Long-term archive", test: (o) => o.purposes.includes("archive") },
];

const state = { options: [], selected: new Set(), active: new Set(), query: "" };

const maxVolume = (o) => VOL[["xlarge", "large", "medium", "small"].find((v) => o.volumes.includes(v))];
function classAttr(o) {
  const c = o.classification_status;
  if (c.confidential === "ok") return ['Up to Confidential', "good"];
  if (c.confidential === "review") return ["Confidential with review", "warn"];
  if (c.sensitive === "ok") return ["Up to Sensitive", ""];
  if (c.sensitive === "review") return ["Sensitive with review", "warn"];
  return ["Unrestricted only", "warn"];
}
const sharing = (o) => (o.audiences.includes("external") ? "Outside collaborators" : o.audiences.includes("team") ? "Your team" : "Just you");

function haystack(o) {
  return [o.name, o.short_name, o.vendor, o.category, o.tagline, o.description, o.cost, o.capacity_label, o.specialty || "",
    ...o.audiences.map((a) => AUD[a]), ...o.purposes.map((p) => USE[p]), classAttr(o)[0]].join(" ").toLowerCase();
}

function visible() {
  const q = state.query.trim().toLowerCase();
  return state.options.filter(
    (o) => [...state.active].every((id) => FILTERS.find((f) => f.id === id).test(o)) && (!q || q.split(/\s+/).every((w) => haystack(o).includes(w)))
  );
}

function renderChips() {
  $("chips").innerHTML = FILTERS.map((f) => `<button type="button" class="fchip" data-f="${f.id}" aria-pressed="${state.active.has(f.id)}">${f.label}</button>`).join("");
  $("chips").querySelectorAll(".fchip").forEach((b) =>
    b.addEventListener("click", () => {
      const id = b.dataset.f;
      state.active.has(id) ? state.active.delete(id) : state.active.add(id);
      b.setAttribute("aria-pressed", state.active.has(id));
      renderTiles();
    })
  );
}

function renderTiles() {
  const list = visible();
  $("found").textContent = `${list.length} of ${state.options.length} services shown`;
  $("tiles").innerHTML = list.length
    ? list
        .map((o) => {
          const [cls, tone] = classAttr(o);
          return `<li><label class="svc">
        <input type="checkbox" value="${o.id}" ${state.selected.has(o.id) ? "checked" : ""} aria-label="Select ${o.name} to compare">
        <span class="svc-card">
          <span class="svc-top">
            <span class="svc-ico">${icon(CATEGORY_ICON[o.category] || "file")}</span>
            <span><span class="svc-name">${o.name}</span><span class="svc-vendor">${o.vendor !== "—" ? o.vendor + " · " : ""}${o.category}</span></span>
            <span class="tick" aria-hidden="true">${icon("check")}</span>
          </span>
          <p class="svc-tag">${o.tagline}</p>
          <span class="attrs">
            <span class="k">Cost</span><span class="v ${o.pricing === "paid" ? "" : "good"}">${pricingLabel(o)}</span>
            <span class="k">Data</span><span class="v ${tone}">${cls}</span>
            <span class="k">Backup</span><span class="v">${o.backup_available ? "Included" : "Not included"}</span>
            <span class="k">Sharing</span><span class="v">${sharing(o)}</span>
            <span class="k">Size</span><span class="v">Up to ${maxVolume(o) === VOL.small ? "25 GB" : maxVolume(o) === VOL.medium ? "1 TB" : maxVolume(o) === VOL.large ? "5 TB" : "petabytes"}</span>
            <span class="k">Best for</span><span class="v">${o.purposes.map((p) => USE[p]).join(", ")}</span>
          </span>
        </span></label></li>`;
        })
        .join("")
    : `<li class="no-results"><strong>No services match.</strong>Clear a filter or change your search.</li>`;
  $("tiles").querySelectorAll("input").forEach((i) =>
    i.addEventListener("change", () => {
      i.checked ? state.selected.add(i.value) : state.selected.delete(i.value);
      updateBar();
    })
  );
  updateBar();
}

function updateBar() {
  const n = state.selected.size;
  const shown = new Set(visible().map((o) => o.id));
  const hidden = [...state.selected].filter((id) => !shown.has(id)).length;
  $("abCount").textContent = `${n} service${n === 1 ? "" : "s"} selected${hidden ? ` (${hidden} hidden by filters)` : ""}`;
  $("goCompare").setAttribute("aria-disabled", String(n < 2));
  $("goCompare").textContent = n < 2 ? "Compare (select 2 or more)" : `Compare ${n} services`;
}

const list = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;

function showCompare(ids) {
  const cols = ids.map((id) => state.options.find((o) => o.id === id)).filter(Boolean);
  if (cols.length < 2) return showBrowse("That link pointed to services that are not available. Choose services to compare below.");
  state.selected = new Set(cols.map((o) => o.id));
  history.replaceState(null, "", "#compare=" + cols.map((o) => o.id).join(","));
  const rows = [
    ["section", "Overview"],
    ["What it is", (o) => o.description],
    ["Best for", (o) => `<span class="strong">${o.tagline}</span>${o.specialty ? `<span class="sub">${o.specialty}</span>` : ""}`],
    ["Technology / vendor", (o) => (o.vendor === "—" ? "Not specified" : o.vendor)],
    ["Type", (o) => o.category],
    ["Who can use it", (o) => o.eligibility],
    ["section", "Cost and capacity"],
    ["Cost", (o) => `<span class="strong">${o.cost}</span><span class="sub">${pricingLabel(o)}</span>`, (o) => o.pricing],
    ["Capacity", (o) => o.capacity_label],
    ["Data size", (o) => o.volumes.map((v) => VOL[v]).join(", "), (o) => o.volumes.join()],
    ["section", "Data classification"],
    ["Unrestricted data", (o) => statusHtml(o.classification_status.unrestricted), (o) => o.classification_status.unrestricted],
    ["Sensitive data", (o) => statusHtml(o.classification_status.sensitive), (o) => o.classification_status.sensitive],
    ["Confidential data", (o) => statusHtml(o.classification_status.confidential), (o) => o.classification_status.confidential],
    ["section", "Protection and sharing"],
    ["Backup", (o) => `<span class="strong">${o.backup_available ? "Included" : "Not included"}</span><span class="sub">${o.backup_note}</span>`, (o) => o.backup_available],
    ["Sharing", (o) => o.audiences.map((a) => AUD[a]).join(", "), (o) => o.audiences.join()],
    ["Good for", (o) => o.purposes.map((p) => USE[p]).join(", "), (o) => o.purposes.join()],
    ["section", "Getting it"],
    ["How to get it", (o) => o.how_to],
    ["Pros", (o) => list(o.pros)],
    ["Cons", (o) => list(o.cons)],
  ];
  const cell = (fn, o) => { const v = fn(o); return v == null ? "" : v; };
  const body = [];
  let pendingSection = null;
  for (const [label, fn, key] of rows) {
    if (label === "section") { pendingSection = fn; continue; }
    const vals = cols.map((o) => cell(fn, o));
    if (vals.every((v) => v === "")) continue;
    if (pendingSection) { body.push(`<tr class="sect"><th class="rl" scope="rowgroup">${pendingSection}</th><td colspan="${cols.length}"></td></tr>`); pendingSection = null; }
    const differs = key && new Set(cols.map(key)).size > 1;
    body.push(`<tr class="${differs ? "diff" : ""}"><th class="rl" scope="row">${label}</th>${vals.map((v) => `<td>${v || "Not listed"}</td>`).join("")}</tr>`);
  }
  $("cvTitle").textContent = `Comparing ${cols.length} services`;
  $("grid").innerHTML = `<table class="grid"><thead><tr><th scope="col"><span class="sr">Attribute</span></th>${cols
    .map((o) => `<th scope="col">${o.name}<small>${o.category}</small></th>`)
    .join("")}</tr></thead><tbody>${body.join("")}</tbody></table>`;
  $("browse").hidden = true;
  $("compareView").hidden = false;
  $("cvTitle").focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showBrowse(note) {
  $("compareView").hidden = true;
  $("browse").hidden = false;
  history.replaceState(null, "", location.pathname);
  renderTiles();
  if (note) $("found").textContent = note;
}

function fromHash() {
  const m = location.hash.match(/compare=([\w,]+)/);
  if (m) showCompare(m[1].split(","));
  else if (!$("compareView").hidden) showBrowse();
}

async function init() {
  $("brandMark").innerHTML = icon("layers");
  $("searchIco").innerHTML = icon("search");
  $("printBtn").innerHTML = `${icon("print")} Print`;
  state.options = await api("/api/options");
  renderChips();
  $("q").addEventListener("input", (e) => { state.query = e.target.value; renderTiles(); });
  $("selAll").addEventListener("click", () => { visible().forEach((o) => state.selected.add(o.id)); renderTiles(); });
  $("selNone").addEventListener("click", () => { state.selected.clear(); renderTiles(); });
  $("goCompare").addEventListener("click", () => { if (state.selected.size >= 2) showCompare([...state.selected]); });
  $("backBtn").addEventListener("click", showBrowse);
  $("printBtn").addEventListener("click", () => window.print());
  initMatrix();
  window.addEventListener("hashchange", fromHash);
  if (/compare=/.test(location.hash)) fromHash(); else renderTiles();
}

init();
