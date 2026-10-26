/* Design demo object (controlfreak-design f5aa8d7 photoreal, DEMO_OBJECTS.md). SVG is inlined in index.html as svg.cf-demo-object;
   state is toggled via root classes driven by the demo's existing controls. Simulation only. No network. */
(function(){var root=document.querySelector(".cfd-device"),st=document.getElementById("cf-stage");if(!root||!st)return;
var svg=st.querySelector("svg.cf-demo-object"),h=root.querySelector(".cfd-header");if(h&&h.nextSibling!==st)h.parentNode.insertBefore(st,h.nextSibling);
function on(l){var b=[].filter.call(root.querySelectorAll(".cfd-toggle"),function(x){return x.textContent===l})[0];return !!b&&b.getAttribute("aria-pressed")==="true";}
function num(s){var e=typeof s==="string"?root.querySelector(s):s;return e?parseFloat(e.textContent):NaN;}
function gauge(i){return num(root.querySelectorAll(".cfd-gauge-value")[i]);}
function C(c,v){svg.classList.toggle(c,!!v);}
function W(k){var w=svg.querySelector("#water");if(w)w.style.transform="scaleY("+k.toFixed(2)+")";}
function UPDATE(){var L=on("Main light")||on("Refugium light"),H=on("Heater"),P=on("Return")||on("Powerhead 1")||on("Powerhead 2"),t=gauge(0);
C("light-on",L);C("heater-on",H);C("pump-on",P);W(1);
return "Tank "+(isNaN(t)?"":t.toFixed(1)+" °F")+": lights "+(L?"on":"off")+", heater "+(H?"on":"off")+", flow "+(P?"on":"paused")+".";}
var last="";function tick(){var t=UPDATE();if(t!==last){st.querySelector(".stage-cap").textContent=t;svg.setAttribute("aria-label",t);last=t;}}tick();setInterval(tick,250);
})();
