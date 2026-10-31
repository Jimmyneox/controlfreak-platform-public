/* Headless half of check_brand.py: drives the C01 demo through every cue and scenario and asserts
   (1) the stage badge, stage caption and app water temperature agree once each state settles, and
   (2) every stage water color (light, tint, ripple, mist) is a C01 palette color.
   Usage: node check_stage.cjs <demo url> <comma-separated palette hex>   (exit 1 on any finding)
   Needs Playwright; check_brand.py points NODE_PATH at the global npm root. */
const { chromium } = require("playwright");
const [url, paletteArg] = process.argv.slice(2);
const PALETTE = new Set(paletteArg.split(",").map((h) => h.toUpperCase()));
const SETTLE_MS = 8000; // hot/cold eases 39 to 102 °F over ~5 s

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && errors.push(`console: ${m.text()}`));
  await page.goto(url, { waitUntil: "load" });

  const read = () => page.evaluate(() => {
    const svg = document.querySelector("#cf-stage svg.cf-demo-object");
    const hex = (c) => { const m = c.match(/\d+(\.\d+)?/g); return m && m.length >= 3 ? m.slice(0, 3).map((v) => (+v).toString(16).padStart(2, "0")).join("").toUpperCase() : c; };
    const colors = [];
    const take = (sel, prop) => svg.querySelectorAll(sel).forEach((el) => {
      const v = getComputedStyle(el)[prop];
      if (v && v !== "none") colors.push({ sel, prop, v, hex: hex(v) });
    });
    take(".cc", "fill"); take("#water-tint", "fill"); take("#flow .ring", "stroke"); take("#mist .puff", "fill");
    return {
      app: document.querySelector("#wt").textContent.trim(),
      badge: (svg.querySelector("#display text") || {}).textContent,
      caption: document.querySelector("#cf-stage .stage-cap").textContent,
      colors,
    };
  });
  const temps = (r) => [parseInt(r.app, 10), parseInt(r.badge, 10), parseInt((r.caption.match(/water (\d+)/) || [])[1], 10)];

  const findings = [];
  let states = 0;
  async function check(label) {
    states++;
    let r, t, t0 = Date.now();
    do { await page.waitForTimeout(250); r = await read(); t = temps(r); }
    while (!(t.every((x) => !isNaN(x)) && t[0] === t[1] && t[1] === t[2]) && Date.now() - t0 < SETTLE_MS);
    if (!(t[0] === t[1] && t[1] === t[2]))
      findings.push(`TEMP      ${label}: app ${r.app} °F, stage badge "${r.badge}", caption "${r.caption}"`);
    const bad = new Map();
    r.colors.forEach((c) => { if (!PALETTE.has(c.hex)) bad.set(`${c.sel} ${c.prop} ${c.v}`, 1); });
    for (const k of bad.keys()) findings.push(`WATER     ${label}: ${k} is not in the C01 palette`);
  }
  const cue = (i) => page.click(`.cfd-cue-tiles input >> nth=${i}`);

  await check("load");
  const cues = await page.locator(".cfd-cue-tiles input").count();
  for (let i = 0; i < cues; i++) { await cue(i); await check(`cue ${i + 1}`); }
  await cue(1);
  for (const [sel, label] of [["#rb", "ready by"], ["#fl", "flow stops"], ["#fl", "flow restored"], ["#hc", "hot"], ["#hc", "cold"],
    ["#alert", "alert example"], [".cfd-notify button", "preview"], ["#clog", "clog filter"], ["#cold", "cold night"]]) {
    await page.click(sel);
    if (sel === "#clog") await page.waitForTimeout(2400);
    if (sel === "#cold") await page.waitForTimeout(5000);
    await check(label);
  }
  await cue(0); await check("back to first cue");
  await browser.close();
  findings.push(...errors.map((e) => `CONSOLE   ${e}`));
  findings.forEach((f) => console.log(f));
  console.log(`stage: ${states} states checked, ${findings.length} finding(s)`);
  process.exit(findings.length ? 1 : 0);
})().catch((e) => { console.log(`STAGE     run failed: ${e.message}`); process.exit(1); });
