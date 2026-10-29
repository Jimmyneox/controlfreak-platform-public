/* Reef Control Pro live demo. Marketing simulation: every value is made up here,
   client-side. No network calls, no storage. Content is limited to
   controlfreak-platform/products/O04-reef/CAPABILITIES.md (°F, On/Off outlets,
   Level OK / Overfill lockout, Dry / Leak, dosing last/next, pH (Pro) example). */
(function () {
  "use strict";
  var root = document.documentElement;
  var $ = function (s) { return document.querySelector(s); };
  var reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Fish ----------
     s = size factor, y/ym = lane height (vh) in landscape/portrait,
     x = resting spot (vw) when motion is reduced. */
  var FISH = [
    { sp: "blue-tang",    dir: "L", depth: "near", s: 1.35, y: 26, ym: 22, x: 14, dur: 36, dl: -6,  und: 0.95 },
    { sp: "yellow-tang",  dir: "R", depth: "near", s: 1.1,  y: 40, ym: 33, x: 40, dur: 31, dl: -19, und: 0.9 },
    { sp: "clownfish",    dir: "R", depth: "near", s: 0.85, y: 55, ym: 42, x: 26, dur: 25, dl: -3,  und: 0.7 },
    { sp: "clownfish",    dir: "L", depth: "near", s: 0.78, y: 62, ym: 47, x: 50, dur: 28, dl: -16, und: 0.7 },
    { sp: "royal-gramma", dir: "R", depth: "near", s: 0.68, y: 48, ym: 38, x: 6,  dur: 23, dl: -12, und: 0.65 },
    { sp: "royal-gramma", dir: "L", depth: "near", s: 0.62, y: 68, ym: 51, x: 60, dur: 27, dl: -22, und: 0.65 },
    { sp: "chromis",      dir: "L", depth: "far",  s: 0.48, y: 20, ym: 17, x: 34, dur: 46, dl: -21, und: 0.6 },
    { sp: "chromis",      dir: "R", depth: "far",  s: 0.44, y: 30, ym: 24, x: 56, dur: 50, dl: -37, und: 0.6 },
    { sp: "chromis",      dir: "L", depth: "far",  s: 0.4,  y: 36, ym: 29, x: 8,  dur: 54, dl: -9,  und: 0.6 },
    { sp: "yellow-tang",  dir: "L", depth: "far",  s: 0.56, y: 44, ym: 31, x: 44, dur: 48, dl: -29, und: 0.8 },
    { sp: "blue-tang",    dir: "R", depth: "far",  s: 0.62, y: 33, ym: 27, x: 22, dur: 52, dl: -42, und: 0.85 }
  ];
  var DIMS = { "blue-tang": [260, 123], "chromis": [182, 83], "clownfish": [260, 148], "royal-gramma": [258, 121], "yellow-tang": [260, 165] };
  var layer = $(".fish-layer");
  FISH.forEach(function (f) {
    var el = document.createElement("div");
    el.className = "fish " + f.depth + (f.dir === "L" ? " left" : "");
    el.dataset.species = f.sp;
    el.style.cssText = "--s:" + f.s + ";--y:" + f.y + "vh;--ym:" + f.ym + "vh;--x:" + f.x +
      ";--dir:swim" + f.dir + ";--dur:" + f.dur + "s;--dl:" + f.dl + "s;--und:" + f.und + "s;--bob:" + (3 + f.s).toFixed(1) + "s";
    el.innerHTML = '<div class="lift"><div class="bob"><div class="flip"><img src="assets/fish/' + f.sp +
      '.webp" width="' + DIMS[f.sp][0] + '" height="' + DIMS[f.sp][1] + '" alt="" decoding="async"></div></div></div>';
    layer.appendChild(el);
  });

  /* Drifting particles */
  var parts = $(".particles");
  for (var i = 0; i < 16; i++) {
    var p = document.createElement("i");
    p.style.cssText = "left:" + (Math.random() * 100).toFixed(1) + "%;--d:" + (1.5 + Math.random() * 2.5).toFixed(1) +
      "px;--t:" + (32 + Math.random() * 30).toFixed(0) + "s;--dl:-" + (Math.random() * 60).toFixed(0) + "s;opacity:" + (0.3 + Math.random() * 0.5).toFixed(2);
    parts.appendChild(p);
  }

  /* ---------- State ---------- */
  var OUTLETS = [
    ["return", "Return", true], ["ph1", "Powerhead 1", true], ["ph2", "Powerhead 2", true],
    ["heater", "Heater", false], ["chiller", "Chiller/fan", false], ["main", "Main light", true],
    ["refugium", "Refugium light", false], ["skimmer", "Skimmer", true]
  ];
  var PUMPS = ["return", "ph1", "ph2"];
  var FEED_SECONDS = 20;
  var NORMAL_TANK = 78.4, NORMAL_SUMP = 77.9, LOW_TANK = 74.2;
  var S = { mode: "normal", tank: NORMAL_TANK, sump: NORMAL_SUMP, tankBase: NORMAL_TANK, scenario: null, feedLeft: 0, out: {} };
  var inputs = {};

  var ul = $("#outlets");
  OUTLETS.forEach(function (o) {
    S.out[o[0]] = o[2];
    var li = document.createElement("li");
    li.innerHTML = '<label class="outlet"><span class="outlet-name"></span><span class="outlet-state" aria-hidden="true"></span>' +
      '<input type="checkbox" switch role="switch"></label>';
    li.querySelector(".outlet-name").textContent = o[1];
    var inp = li.querySelector("input");
    inp.checked = o[2];
    inp.addEventListener("change", function () { setOutlet(o[0], inp.checked); });
    inputs[o[0]] = { inp: inp, state: li.querySelector(".outlet-state") };
    ul.appendChild(li);
  });

  /* Dosing (Pro): last and next dose as clock times around now. */
  var fmt = function (d) { return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }); };
  var now = new Date(); now.setMinutes(0, 0, 0);
  var hr = function (h) { return new Date(now.getTime() + h * 3600e3); };
  [["Ca", "Calcium", -2, 4], ["Alk", "Alkalinity", -1, 5], ["Mg", "Magnesium", -3, 3]].forEach(function (d) {
    var li = document.createElement("li");
    li.innerHTML = '<span class="dose-name"><b>' + d[0] + "</b>" + d[1] + '</span><span class="dose-times">Last ' + fmt(hr(d[2])) + " · Next " + fmt(hr(d[3])) + "</span>";
    $("#dosing").appendChild(li);
  });

  /* ---------- Rendering ---------- */
  var f1 = function (v) { return v.toFixed(1) + " °F"; };
  function paintTemps() {
    $("#v-tank").textContent = f1(S.tank);
    $("#v-sump").textContent = f1(S.sump);
  }
  function setOutlet(key, on) {
    S.out[key] = on;
    inputs[key].inp.checked = on;
    inputs[key].state.textContent = on ? "On" : "Off";
    if (key === "main") root.classList.toggle("light-off", !on);
    if (PUMPS.indexOf(key) > -1) currentChanged();
  }
  /* With the return and powerheads off the water goes still: slow the drift. */
  function currentChanged() {
    var still = !S.out.ph1 && !S.out.ph2 && !S.out.return;
    document.querySelectorAll(".particles i, .caustics").forEach(function (el) {
      if (el.getAnimations) el.getAnimations().forEach(function (a) { a.updatePlaybackRate(still ? 0.3 : 1); });
    });
  }
  function setPumps(on) { PUMPS.forEach(function (k) { setOutlet(k, on); }); }
  OUTLETS.forEach(function (o) { setOutlet(o[0], o[2]); });

  /* ---------- Modes ---------- */
  var feedTimer = null;
  var status = $("#mode-status");
  function setMode(m) {
    S.mode = m;
    document.querySelector('input[name=mode][value="' + m + '"]').checked = true;
    clearInterval(feedTimer); feedTimer = null;
    root.classList.toggle("feeding", m === "feed");
    if (m === "normal") { setPumps(true); status.textContent = "Pumps running."; }
    if (m === "maint") { setPumps(false); status.textContent = "Maintenance: return and powerheads Off until you tap Normal."; }
    if (m === "feed") {
      setPumps(false);
      S.feedLeft = FEED_SECONDS;
      dropFlakes();
      paintFeed();
      feedTimer = setInterval(function () {
        if (root.classList.contains("is-paused")) return;
        S.feedLeft--;
        if (S.feedLeft <= 0) { setMode("normal"); status.textContent = "Feed done. Pumps back On."; return; }
        paintFeed();
      }, 1000);
    }
  }
  function paintFeed() {
    status.textContent = "Feed: return and powerheads Off. Pumps resume on their own in 0:" + String(S.feedLeft).padStart(2, "0") + ".";
  }
  document.querySelectorAll("input[name=mode]").forEach(function (r) {
    r.addEventListener("change", function () { if (r.checked) setMode(r.value); });
  });

  var flakes = $(".flakes");
  function dropFlakes() {
    flakes.textContent = "";
    var portrait = matchMedia("(orientation: portrait)").matches;
    var tints = ["rgba(232,224,206,.92)", "rgba(206,188,168,.9)", "rgba(190,206,170,.88)"];
    for (var i = 0; i < 18; i++) {
      var k = document.createElement("i");
      var x = portrait ? 12 + Math.random() * 76 : 10 + Math.random() * 50;
      k.style.cssText = "--x:" + x.toFixed(1) + "vw;--w:" + (7 + Math.random() * 5).toFixed(1) + "px;--t:" + (9 + Math.random() * 6).toFixed(1) +
        "s;--dl:" + (Math.random() * 4).toFixed(1) + "s;--fy:" + (6 + Math.random() * 12).toFixed(1) + "vh;--c:" + tints[i % 3];
      flakes.appendChild(k);
    }
  }

  /* ---------- Demo scenarios ---------- */
  var ICON = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 3.5l9 16H3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 10v4.5M12 17.2v.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  var alerts = $("#alerts");
  var dropTimer = null, pushTimer = null;

  function showAlert(title, sub) {
    alerts.innerHTML = '<div class="alert-card">' + ICON + '<span class="alert-title"></span><span class="alert-sub"></span>' +
      '<button type="button" class="btn btn-quiet" data-reset>Reset</button></div>';
    alerts.querySelector(".alert-title").textContent = title;
    alerts.querySelector(".alert-sub").textContent = sub;
  }
  function push(text) {
    var el = $("#push");
    $("#push-body").textContent = text;
    el.hidden = false;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(function () { el.hidden = true; }, 6500);
  }
  function scenarioButtons() {
    document.querySelectorAll("[data-scenario]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.scenario === S.scenario));
    });
  }

  function reset() {
    clearInterval(dropTimer); dropTimer = null;
    S.scenario = null;
    S.tankBase = NORMAL_TANK; S.tank = NORMAL_TANK;
    alerts.textContent = "";
    $("#t-tank").classList.remove("is-warn");
    $("#t-leak").classList.remove("is-warn");
    $("#t-ato").classList.remove("is-warn");
    $("#v-leak").textContent = "Dry";
    $("#v-ato").textContent = "Level OK";
    $("#s-ato").textContent = " ";
    setOutlet("heater", false);
    $("#push").hidden = true;
    paintTemps();
    scenarioButtons();
  }

  function lowTemp() {
    reset();
    S.scenario = "low";
    scenarioButtons();
    setOutlet("heater", true); /* the controller calls for heat below your limit */
    var start = S.tank, steps = reduceMotion.matches ? 1 : 16, n = 0;
    dropTimer = setInterval(function () {
      if (root.classList.contains("is-paused")) return;
      n++;
      S.tank = start + (LOW_TANK - start) * (n / steps);
      S.tankBase = S.tank;
      paintTemps();
      if (n >= steps) {
        clearInterval(dropTimer); dropTimer = null;
        S.tank = S.tankBase = LOW_TANK; paintTemps();
        $("#t-tank").classList.add("is-warn");
        showAlert("Low temperature · " + f1(LOW_TANK), "Check your heater");
        push("Low temperature · " + f1(LOW_TANK) + ". Check your heater.");
      }
    }, 350);
  }

  function leak() {
    reset();
    S.scenario = "leak";
    scenarioButtons();
    $("#v-leak").textContent = "Leak";
    $("#t-leak").classList.add("is-warn");
    $("#v-ato").textContent = "Locked out";
    $("#s-ato").textContent = "Leak detected";
    $("#t-ato").classList.add("is-warn");
    showAlert("Water leak detected", "Top-off locked out");
    push("Water leak detected under the stand. Top-off locked out.");
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-scenario],[data-reset]");
    if (!t) return;
    if (t.hasAttribute("data-reset")) return reset();
    if (t.dataset.scenario === "low") lowTemp();
    if (t.dataset.scenario === "leak") leak();
  });

  /* Gentle sensor jitter; held still while a scenario owns the reading. */
  setInterval(function () {
    if (root.classList.contains("is-paused")) return;
    if (S.scenario !== "low") S.tank = S.tankBase + (Math.random() - 0.5) * 0.2;
    S.sump = NORMAL_SUMP + (Math.random() - 0.5) * 0.2;
    paintTemps();
  }, 2400);

  /* ---------- Bottom sheet (phones) ---------- */
  var panel = $("#panel"), more = $(".more-toggle");
  more.addEventListener("click", function () {
    var open = panel.dataset.expanded !== "true";
    panel.dataset.expanded = String(open);
    more.setAttribute("aria-expanded", String(open));
  });

  /* ---------- Pause when the tab is hidden ---------- */
  function vis() { root.classList.toggle("is-paused", document.hidden); }
  document.addEventListener("visibilitychange", vis); vis();

  /* ---------- Pointer parallax (desktop, motion allowed) ---------- */
  if (matchMedia("(pointer: fine)").matches && !reduceMotion.matches) {
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    var step = function () {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      root.style.setProperty("--px", cx.toFixed(3));
      root.style.setProperty("--py", cy.toFixed(3));
      raf = (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.002) ? requestAnimationFrame(step) : 0;
    };
    addEventListener("pointermove", function (e) {
      tx = e.clientX / innerWidth * 2 - 1; ty = e.clientY / innerHeight * 2 - 1;
      if (!raf && !document.hidden) raf = requestAnimationFrame(step);
    }, { passive: true });
  }

  /* Hook for review screenshots: ?state=feed|night|low|leak */
  var q = new URLSearchParams(location.search).get("state");
  if (q === "feed") setMode("feed");
  if (q === "night") setOutlet("main", false);
  if (q === "low") lowTemp();
  if (q === "leak") leak();
})();
