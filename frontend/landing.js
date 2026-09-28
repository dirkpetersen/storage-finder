async function init() {
  $("brandMark").innerHTML = icon("layers");
  $("icoSimple").innerHTML = icon("drive");
  $("icoSelect").innerHTML = icon("check");
  $("icoWizard").innerHTML = icon("star");
  const cls = await api("/api/classifications");
  const glyph = { unrestricted: "globe", sensitive: "lock", confidential: "shield" };
  $("levels").innerHTML = ["unrestricted", "sensitive", "confidential"]
    .map(
      (k) => `<div class="level"><h3>${icon(glyph[k])}${cls[k].label}</h3><p>${cls[k].summary}</p>
      <p class="eg">For example: ${cls[k].examples.slice(0, 4).join(", ")}.</p>
      <p class="eg"><strong>Where it can go:</strong> ${cls[k].policy}</p></div>`
    )
    .join("");
  $("note").innerHTML = `${icon("info")}<span>${cls.unrestricted.note}</span>`;
}
init();
