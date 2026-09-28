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
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/>',
  gauge: '<path d="M4 18a9 9 0 1116 0"/><path d="M12 18l4-6"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.2"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
};

function icon(name) {
  return `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;
}

function buildSteps(cls) {
  return [
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
    {
      key: "cost",
      label: "Cost",
      title: "How do you want to pay?",
      sub: "You can stay entirely within the free quota the university provides, or buy the capacity you need.",
      options: [
        { value: "quota", icon: "gauge", title: "Free, within a quota", chip: "Free within a quota", desc: "No charges. Only show services that fit inside a free quota." },
        { value: "paid", icon: "tag", title: "Paid capacity", chip: "Paid capacity", desc: "I can pay for what I need. Show the pricing options." },
        { value: "either", icon: "layers", title: "Show me both", chip: "Free or paid", desc: "Rank free and paid services together.", wizardOnly: true },
      ],
    },
  ];
}

const $ = (id) => document.getElementById(id);

const STATUS = {
  ok: () => `<span class="st st-ok">${icon("check")} Yes</span>`,
  review: () => `<span class="st st-review">${icon("alert")} Needs review</span>`,
  no: () => `<span class="st st-no">${icon("x")} No</span>`,
};
const statusHtml = (v) => (v.startsWith("text:") ? v.slice(5) : STATUS[v]());

async function api(path, body) {
  const res = await fetch(path, body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : undefined);
  return res.json();
}

function initMatrix() {
  const btn = $("matrixToggle");
  const wrap = $("matrixWrap");
  let loaded = false;
  btn.addEventListener("click", async () => {
    wrap.hidden = !wrap.hidden;
    btn.textContent = wrap.hidden ? "Show table" : "Hide table";
    btn.setAttribute("aria-expanded", String(!wrap.hidden));
    if (wrap.hidden || loaded) return;
    loaded = true;
    const rows = await api("/api/matrix");
    wrap.innerHTML = `<table class="cmp"><thead><tr><th>System</th><th>Unrestricted</th><th>Sensitive</th><th>Confidential</th></tr></thead><tbody>${rows
      .map((r) => `<tr><th scope="row">${r.name}${r.note ? `<small>${r.note}</small>` : ""}</th><td>${statusHtml(r.unrestricted)}</td><td>${statusHtml(r.sensitive)}</td><td>${statusHtml(r.confidential)}</td></tr>`)
      .join("")}</tbody></table>`;
  });
}

const pricingLabel = (o) => ({ quota: "Free within a quota", paid: "Paid capacity", both: "Free start, then paid" })[o.pricing];
