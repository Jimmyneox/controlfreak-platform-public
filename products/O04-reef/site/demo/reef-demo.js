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
  var NORMAL_TANK = 78.4, NORMAL_SUMP = 77.9, LOW_TANK = 74.2;
  var S = { mode: "normal", tank: NORMAL_TANK, sump: NORMAL_SUMP, tankBase: NORMAL_TANK, scenario: null, out: {} };
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

  /* ---------- Cues ----------
     A cue sets every switched outlet and the heater limit in one tap, like a home
     automation scene. The heater itself follows its limit, so it is not a cue switch.
     Each changed outlet can carry its own time: when it runs out, that outlet goes back
     to its Normal setting. Once every changed outlet is timed and done, the cue ends.
     Customers can edit any cue or add their own (kept in memory only, never stored).
     The demo clock runs 10x fast so a timed cue ends while someone is watching. */
  var ICONS = {
    waves: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
    fish: '<path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M18 12v.5"/><path d="M16 17.93a9.77 9.77 0 0 1 0-11.86"/><path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33"/><path d="M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4"/><path d="m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H8c1.17-1.24 2.2-2.88 2.46-4.26"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>'
  };
  var svg = function (k) { return '<svg class="cue-ico" viewBox="0 0 24 24" aria-hidden="true">' + ICONS[k] + "</svg>"; };
  var SWITCHED = OUTLETS.filter(function (o) { return o[0] !== "heater"; });
  var NAME = {}; OUTLETS.forEach(function (o) { NAME[o[0]] = o[1]; });
  var NORMAL_OUT = {}; SWITCHED.forEach(function (o) { NORMAL_OUT[o[0]] = o[2]; });
  var MINUTES = [0, 1, 2, 5, 10, 15, 30, 60];
  /* set: outlet overrides, dur: minutes per outlet (0 = until you tap Normal) */
  function cue(id, name, icon, set, dur) {
    var out = Object.assign({}, NORMAL_OUT), d = {};
    SWITCHED.forEach(function (o) { d[o[0]] = 0; });
    Object.assign(out, set); Object.assign(d, dur);
    return { id: id, name: name, icon: icon, out: out, dur: d, heat: 78 };
  }
  var CUES = [
    cue("normal", "Normal", "waves", {}, {}),
    cue("feed", "Feed", "fish", { return: false, ph1: false, ph2: false, skimmer: false }, { return: 2, ph1: 2, ph2: 2, skimmer: 10 }),
    cue("maint", "Maintenance", "wrench", { return: false, ph1: false, ph2: false, skimmer: false }, {})
  ];
  var MAX_CUES = 6, newId = 0;
  var byId = function (id) { return CUES.filter(function (c) { return c.id === id; })[0]; };
  var cueBox = $("#cues"), status = $("#mode-status"), cueTimer = null, left = {};
  var changed = function (c) { var b = byId("normal").out; return SWITCHED.map(function (o) { return o[0]; }).filter(function (k) { return c.out[k] !== b[k]; }); };

  function summary(c) {
    if (c.id === "normal") return "Your everyday setup";
    var ks = changed(c), pumpsOff = PUMPS.every(function (k) { return !c.out[k]; });
    if (!ks.length) return "Same outlets as Normal";
    var pd = PUMPS.map(function (k) { return c.dur[k]; });
    if (pumpsOff && pd[0] && pd.every(function (m) { return m === pd[0]; })) return "Pumps pause, back in " + pd[0] + " min";
    if (pumpsOff && !pd.some(Boolean)) return "Pumps off until you’re done";
    var timed = ks.filter(function (k) { return c.dur[k]; }).length;
    return ks.length + (ks.length === 1 ? " outlet changes" : " outlets change") + (timed ? ", " + (timed === ks.length ? "all timed" : timed + " timed") : "");
  }
  function renderCues() {
    cueBox.textContent = "";
    CUES.forEach(function (c) {
      var l = document.createElement("label");
      l.innerHTML = '<input type="radio" name="mode"><span class="cue">' + svg(c.icon) + "<b></b><small></small></span>";
      var r = l.querySelector("input");
      r.value = c.id; r.checked = c.id === S.mode;
      l.querySelector("b").textContent = c.name;
      l.querySelector("small").textContent = summary(c);
      r.addEventListener("change", function () { if (r.checked) setMode(c.id); });
      cueBox.appendChild(l);
    });
  }
  function clock(sec) { return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0"); }
  /* One phrase per group of outlets that share a setting and a time left, e.g.
     "Return, Powerhead 1, Powerhead 2 Off for 1:40. Skimmer Off for 9:40." */
  function statusText(c) {
    var groups = [], seen = {};
    changed(c).forEach(function (k) {
      var timed = k in left;
      if (c.dur[k] && !timed) return; /* its time ran out: back to Normal */
      var tail = timed ? " for " + clock(left[k]) : " until you tap Normal";
      var key = (c.out[k] ? "On" : "Off") + tail;
      if (!(key in seen)) { seen[key] = groups.length; groups.push({ key: key, names: [] }); }
      groups[seen[key]].names.push(NAME[k]);
    });
    var t = groups.map(function (g) { return g.names.join(", ") + " " + g.key + "."; }).join(" ");
    return c.name + ": " + (t || "Same outlets as Normal.") + (Object.keys(left).length ? " (Demo clock runs 10× fast.)" : "");
  }
  function paintLeft() {
    SWITCHED.forEach(function (o) {
      var k = o[0];
      inputs[k].state.textContent = (S.out[k] ? "On" : "Off") + (k in left ? " · " + clock(left[k]) : "");
    });
  }
  function setMode(id) {
    var c = byId(id) || CUES[0], base = byId("normal").out;
    S.mode = c.id;
    var r = cueBox.querySelector('input[value="' + c.id + '"]'); if (r) r.checked = true;
    clearInterval(cueTimer); cueTimer = null; left = {};
    SWITCHED.forEach(function (o) { setOutlet(o[0], c.out[o[0]]); });
    S.heat = c.heat;
    $("#s-tank").textContent = "Probe 1 · limit " + c.heat.toFixed(1) + " °F";
    root.classList.toggle("feeding", c.icon === "fish");
    if (c.icon === "fish") dropFlakes();
    if (c.id === "normal") { status.textContent = PUMPS.every(function (k) { return c.out[k]; }) ? "Pumps running." : "Normal: pumps Off in your Normal cue."; return; }
    var ks = changed(c);
    ks.forEach(function (k) { if (c.dur[k]) left[k] = c.dur[k] * 60; });
    var allTimed = ks.length > 0 && ks.every(function (k) { return c.dur[k]; });
    status.textContent = statusText(c); paintLeft();
    if (!Object.keys(left).length) return;
    cueTimer = setInterval(function () {
      if (root.classList.contains("is-paused")) return;
      Object.keys(left).forEach(function (k) {
        left[k] = Math.max(0, left[k] - 10);
        if (!left[k]) { delete left[k]; setOutlet(k, base[k]); }
      });
      if (!Object.keys(left).length) {
        clearInterval(cueTimer); cueTimer = null;
        if (allTimed) { setMode("normal"); status.textContent = c.name + " done. Back to Normal."; return; }
      }
      status.textContent = statusText(c); paintLeft();
    }, 1000);
  }

  /* Cue editor (settings) */
  var dlg = $("#cue-editor"), editing = null;
  var ceIcons = $("#ce-icons"), ceOut = $("#ce-outlets"), cePick = $("#ce-pick");
  Object.keys(ICONS).forEach(function (k) {
    var l = document.createElement("label");
    l.innerHTML = '<input type="radio" name="ce-icon"><span>' + svg(k) + "</span>";
    l.querySelector("input").value = k;
    l.querySelector("input").setAttribute("aria-label", k);
    ceIcons.appendChild(l);
  });
  var opts = MINUTES.map(function (m) { return '<option value="' + m + '">' + (m ? m + " min" : "Until Normal") + "</option>"; }).join("");
  SWITCHED.forEach(function (o) {
    var li = document.createElement("li");
    li.innerHTML = '<label class="outlet"><span class="outlet-name"></span><input type="checkbox" switch role="switch"></label><select class="ce-time"></select>';
    li.querySelector(".outlet-name").textContent = o[1];
    var sw = li.querySelector("input"), sel = li.querySelector("select");
    sw.dataset.key = sel.dataset.key = o[0];
    sel.innerHTML = opts;
    sel.setAttribute("aria-label", o[1] + ": how long");
    sw.addEventListener("change", syncTimes);
    ceOut.appendChild(li);
  });
  /* A time only means something when the outlet differs from Normal. */
  function syncTimes() {
    var isNormal = editing && editing.id === "normal", base = byId("normal").out;
    ceOut.classList.toggle("no-times", !!isNormal);
    ceOut.querySelectorAll("li").forEach(function (li) {
      var sw = li.querySelector("input"), sel = li.querySelector("select");
      sel.disabled = isNormal || sw.checked === base[sw.dataset.key];
      li.classList.toggle("is-changed", !sel.disabled);
    });
  }
  function renderPick() {
    cePick.textContent = "";
    CUES.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "ce-chip"; b.textContent = c.name;
      b.setAttribute("role", "radio"); b.setAttribute("aria-checked", String(c === editing));
      b.addEventListener("click", function () { load(c); });
      cePick.appendChild(b);
    });
  }
  function load(c) {
    editing = c;
    renderPick();
    $("#ce-name").value = c.name;
    ceIcons.querySelector('input[value="' + c.icon + '"]').checked = true;
    ceOut.querySelectorAll("input").forEach(function (i) { i.checked = !!c.out[i.dataset.key]; });
    ceOut.querySelectorAll("select").forEach(function (s) { s.value = String(c.dur[s.dataset.key] || 0); });
    $("#ce-heat").value = c.heat;
    $("#ce-times-hint").hidden = c.id === "normal";
    $("#ce-delete").hidden = ["normal", "feed", "maint"].indexOf(c.id) > -1;
    $("#ce-new").disabled = CUES.length >= MAX_CUES;
    syncTimes();
  }
  function save() {
    if (!editing) return;
    var c = editing;
    c.name = $("#ce-name").value.trim() || c.name;
    c.icon = ceIcons.querySelector("input:checked").value;
    ceOut.querySelectorAll("input").forEach(function (i) { c.out[i.dataset.key] = i.checked; });
    ceOut.querySelectorAll("select").forEach(function (s) { c.dur[s.dataset.key] = s.disabled ? 0 : parseInt(s.value, 10) || 0; });
    var h = parseFloat($("#ce-heat").value); if (h >= 72 && h <= 84) c.heat = Math.round(h * 2) / 2;
    if (CUES.indexOf(c) < 0) CUES.push(c);
    renderCues();
    if (S.mode === c.id) setMode(c.id);
  }
  $("#cue-edit-btn").addEventListener("click", function () { load(byId(S.mode) || CUES[0]); dlg.showModal(); });
  $("#ce-new").addEventListener("click", function () {
    newId++;
    var c = cue("c" + newId, "My cue " + newId, "moon", {}, {});
    c.out = Object.assign({}, byId("normal").out);
    load(c);
    $("#ce-delete").hidden = true;
    $("#ce-name").select();
  });
  $("#ce-delete").addEventListener("click", function () {
    var i = CUES.indexOf(editing); if (i < 0) return;
    CUES.splice(i, 1);
    if (S.mode === editing.id) setMode("normal");
    renderCues(); load(CUES[0]);
  });
  dlg.addEventListener("close", function () {
    if (dlg.returnValue === "save") save();
    dlg.returnValue = ""; editing = null;
  });
  renderCues();

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
