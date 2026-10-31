/* C01 Lamplight. Local, in-memory marketing simulation only. No network calls. */
(function () {
  "use strict";
  var root = document.querySelector(".cfd-device"),
    C = window.CFD_CONFIG;
  var $ = function (s) {
    return root.querySelector(s);
  };
  var reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  var S = {
    out: {},
    hot: false,
    target: 39,
    plungeTarget: 39,
    water: 39,
    air: 46,
    outlet: 37,
    noFlow: false,
    cold: false,
    scenario: null,
    schedule: 0,
  };
  var switches = {},
    temperatureTimer = null,
    scenarioTimer = null,
    coldTimer = null;
  var schedules = [
    ["6:30", "4:50"],
    ["6:00", "4:20"],
    ["7:00", "5:20"],
    ["5:45", "4:05"],
  ];
  function say(message, warning) {
    var el = $("#status");
    el.hidden = false;
    el.textContent = message;
    el.classList.toggle("alert", !!warning);
  }
  function actual(key) {
    if (key === "Heater") return S.hot || S.out.Heater;
    if (key === "Pump") return S.cold || S.out.Pump;
    if (key === "Chiller")
      return (
        S.out.Chiller &&
        actual("Pump") &&
        !S.noFlow &&
        !S.hot &&
        !actual("Heater")
      );
    if (key === "Ozone" || key === "UV")
      return S.out[key] && actual("Pump") && !S.noFlow;
    return S.out[key];
  }
  function paintOutlets() {
    Object.keys(switches).forEach(function (key) {
      var on = !!actual(key),
        item = switches[key];
      item.button.setAttribute("aria-checked", String(on));
      item.state.textContent = on ? "On" : "Off";
    });
    var flowing = !S.noFlow && actual("Pump");
    $("#flow-text").textContent = S.noFlow
      ? "No flow · chiller stopped"
      : flowing
        ? "Flow OK"
        : "Flow paused · chiller off";
    $("#flow").classList.toggle("warn", S.noFlow);
    $("#equipment").textContent =
      "Chiller " +
      (actual("Chiller") ? "running" : "off") +
      " · Ozone and UV " +
      (actual("Ozone") && actual("UV") ? "on with pump" : "off") +
      (S.cold ? " · Winter mode on" : "");
  }
  function setOutlet(key, on) {
    S.out[key] = !!on;
    paintOutlets();
  }
  // Keys remain compatible with CFD_CONFIG. Distinct spare keys have distinct accessible names.
  [
    "Chiller",
    "Lights",
    "Pump",
    "UV",
    "Ozone",
    "Spare",
    "Heater",
    "Spare 2",
  ].forEach(function (key) {
    var config = C.controls.find(function (c) {
      return c.label === key;
    });
    S.out[key] = !!config.on;
    var row = document.createElement("div");
    row.className = "outlet";
    var name = document.createElement("span");
    name.className = "outlet-name";
    var label =
      key === "Pump"
        ? "Circulation pump"
        : key.indexOf("Spare") === 0
          ? "Spare"
          : key;
    name.textContent = label;
    var button = document.createElement("button");
    button.type = "button";
    button.className = "switch cfd-toggle";
    button.dataset.key = key;
    button.setAttribute("role", "switch");
    button.setAttribute(
      "aria-label",
      key === "Spare"
        ? "Spare outlet 1"
        : key === "Spare 2"
          ? "Spare outlet 2"
          : label,
    );
    button.innerHTML = '<i aria-hidden="true"></i>';
    var state = document.createElement("span");
    state.className = "outlet-state";
    state.setAttribute("aria-hidden", "true");
    switches[key] = { button: button, state: state };
    button.addEventListener("click", function () {
      if (key === "Heater") {
        setHot(!actual("Heater"));
        return;
      }
      if (key === "Pump" && S.cold) {
        say(
          "SIMULATED · Winter mode keeps the pump running while air is near freezing. Reset to clear.",
        );
        return;
      }
      S.out[key] = !actual(key);
      paintOutlets();
      say(
        "SIMULATED · " +
          label +
          " " +
          (actual(key) ? "on." : "off.") +
          (key === "Chiller" && S.out.Chiller && !actual("Chiller")
            ? " Chiller only runs with flow, with the heater off."
            : "") +
          (key === "Pump" && !actual("Pump")
            ? " Chiller, ozone and UV off while water is not moving."
            : ""),
      );
    });
    row.append(name, button, state);
    $(".outlets").appendChild(row);
  });
  function paintWater() {
    $("#water").textContent = Math.round(S.water);
    $("#target").textContent = "target " + S.target + " °F";
    var progress = S.hot
      ? (S.water - 39) / (S.target - 39)
      : (102 - S.water) / (102 - S.target);
    $("#ring").style.strokeDashoffset = String(
      270.18 * (1 - Math.max(0, Math.min(1, progress))),
    );
  }
  function moveWater() {
    clearInterval(temperatureTimer);
    paintWater();
    if (reduceMotion.matches) {
      S.water = S.target;
      paintWater();
      return;
    }
    temperatureTimer = setInterval(function () {
      if (document.hidden) return;
      S.water += (S.target - S.water) * 0.3;
      if (Math.abs(S.target - S.water) < 0.5) {
        S.water = S.target;
        clearInterval(temperatureTimer);
      }
      paintWater();
    }, 300);
  }
  function setHot(hot) {
    S.hot = hot;
    S.out.Heater = hot;
    S.out.Chiller = !hot;
    S.target = hot ? 102 : S.plungeTarget;
    $("#hot").setAttribute("aria-checked", String(hot));
    $("#hot-state").textContent = hot ? "Warm soak" : "Plunge";
    paintOutlets();
    moveWater();
    say(
      "SIMULATED · " +
        (hot
          ? "Warm soak: heater outlet on, chiller off. Target 102 °F (example)."
          : "Back to plunge: heater off, chiller on. Target " +
            S.target +
            " °F."),
    );
  }
  root.addEventListener("cfd:cue", function (e) {
    S.plungeTarget = e.detail.target;
    if (!S.hot) {
      S.target = S.plungeTarget;
      moveWater();
    }
    paintOutlets();
    say(
      "SIMULATED · " +
        e.detail.name +
        " cue selected. Water target " +
        S.target +
        " °F." +
        (e.detail.name === "Soak"
          ? " Pump, ozone and UV off for 15 min. Demo clock runs 10× fast."
          : "") +
        (e.detail.name === "Clean" ? " Chiller, pump, ozone and UV off." : ""),
    );
  });
  cues(root, C, setOutlet);
  $("#hot").addEventListener("click", function () {
    setHot(!S.hot);
  });
  $("#schedule").addEventListener("click", function () {
    S.schedule = (S.schedule + 1) % schedules.length;
    var time = schedules[S.schedule];
    $("#ready").textContent = time[0];
    $("#cooling").textContent = "Starts cooling at " + time[1] + " (example)";
    say(
      "SIMULATED · Ready by " +
        time[0] +
        ": chiller starts at " +
        time[1] +
        " so the water hits " +
        S.plungeTarget +
        " °F on time.",
    );
  });
  function clearScenarios() {
    clearTimeout(scenarioTimer);
    clearInterval(coldTimer);
    S.noFlow = false;
    S.cold = false;
    S.scenario = null;
    S.air = 46;
    document.querySelectorAll("[data-scenario]").forEach(function (b) {
      b.setAttribute("aria-pressed", "false");
    });
  }
  function reset(quiet) {
    clearScenarios();
    clearInterval(temperatureTimer);
    S.hot = false;
    S.out.Heater = false;
    C.controls.forEach(function (c) {
      S.out[c.label] = c.on;
    });
    S.schedule = 0;
    $("#ready").textContent = "6:30";
    $("#cooling").textContent = "Starts cooling at 4:50 (example)";
    $("#hot").setAttribute("aria-checked", "false");
    $("#hot-state").textContent = "Plunge";
    root.dispatchEvent(new Event("cfd:reset"));
    clearInterval(temperatureTimer);
    S.water = S.target;
    paintWater();
    paintOutlets();
    paintSensors();
    if (quiet) $("#status").hidden = true;
    else
      say(
        "SIMULATED · Reset. Back to Plunge. Flow OK. Filter clean. Chiller cooling normally. Winter mode standby.",
      );
  }
  function flow(ok) {
    S.noFlow = !ok;
    paintOutlets();
    say(
      ok
        ? "SIMULATED · Flow restored, chiller back on."
        : "SIMULATED WHAT-IF · No flow. Chiller stopped so it can’t run dry. Alert sent. Push · Text · Email · Alarm.",
      !ok,
    );
  }
  document.querySelectorAll("[data-scenario]").forEach(function (button) {
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", function () {
      var which = button.dataset.scenario,
        restore = which === "flow" && S.noFlow;
      clearScenarios();
      S.scenario = which;
      button.setAttribute("aria-pressed", "true");
      if (which === "flow") {
        // Restoring flow also restores the normal pump/chiller request.
        if (restore) {
          S.out.Pump = true;
          S.out.Chiller = true;
          button.setAttribute("aria-pressed", "false");
        }
        flow(restore);
      }
      if (which === "clog") {
        paintOutlets();
        say("SIMULATED · Filter pressure rising. Clean the filter soon.", true);
        scenarioTimer = setTimeout(function () {
          S.noFlow = true;
          paintOutlets();
          say(
            "SIMULATED ALERT · Flow low. Chiller stopped safely. Clean the filter, then tap Flow stops to clear.",
            true,
          );
        }, 2200);
      }
      if (which === "cold") {
        paintOutlets();
        var air = 46;
        function coldStep() {
          air = Math.max(31, air - 3);
          S.air = air;
          paintSensors();
          if (air <= 31) {
            clearInterval(coldTimer);
            S.cold = true;
            paintOutlets();
            say(
              "SIMULATED · Cold night: air 31 °F. Winter mode runs the pump to protect the tub and pipes.",
            );
          }
        }
        say("SIMULATED · Cold night: air temperature falling.");
        if (reduceMotion.matches) {
          air = 31;
          coldStep();
        } else coldTimer = setInterval(coldStep, 450);
      }
    });
  });
  $("#reset").addEventListener("click", function () {
    reset(false);
  });
  var examples = [
      "Water too warm: 45 °F at your ready-by time",
      "No flow. Chiller stopped",
      "Filter: clean soon",
      "Cold night: winter mode running the pump",
      "Chiller health: cooling slower than usual",
    ],
    example = 0;
  $("#alert-example").addEventListener("click", function () {
    var text = examples[example++ % examples.length];
    say(
      "SIMULATED ALERT · " +
        text +
        ". Push · Text · Email · Alarm. Example only.",
      text.indexOf("Cold night") !== 0,
    );
  });
  function paintSensors() {
    $("#air").textContent = S.air.toFixed(1).replace(/\.0$/, "");
    $("#outlet").textContent = S.outlet.toFixed(1).replace(/\.0$/, "");
  }
  setInterval(function () {
    if (document.hidden) return;
    if (S.scenario !== "cold")
      S.air = Math.max(
        C.readouts[0].min,
        Math.min(
          C.readouts[0].max,
          S.air +
            (Math.random() - 0.5) * 2 * C.readouts[0].jitter +
            (46 - S.air) * 0.1,
        ),
      );
    S.outlet = Math.max(
      30,
      Math.min(
        70,
        S.outlet +
          (Math.random() - 0.5) * 2 * C.readouts[1].jitter +
          (37 - S.outlet) * 0.1,
      ),
    );
    paintSensors();
  }, 1800);
  paintOutlets();
  paintWater();
})();

// When embedded on the product page, report the content height so the iframe fits it.
// Sums in-flow content only: main and the fixed caption stretch with the iframe height.
(function () {
  if (window.parent === window) return;
  var panel = document.querySelector(".cfd-device");
  var caption = document.querySelector(".caption");
  if (!panel) return;
  var last = 0;
  function send() {
    var main = panel.parentElement;
    var bottom = panel.getBoundingClientRect().bottom + parseFloat(getComputedStyle(main).paddingBottom);
    if (caption && getComputedStyle(caption).position === "static") {
      bottom = Math.max(bottom, caption.getBoundingClientRect().bottom);
    }
    var h = Math.ceil(bottom + window.scrollY);
    if (Math.abs(h - last) < 2) return;
    last = h;
    try { window.parent.postMessage({ cfDemoHeight: h }, "*"); } catch (e) {}
  }
  addEventListener("load", send);
  addEventListener("resize", send);
  if (window.ResizeObserver) new ResizeObserver(send).observe(panel);
  send();
})();
