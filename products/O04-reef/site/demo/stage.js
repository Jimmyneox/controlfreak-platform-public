/* Design demo object (controlfreak-design f39dfd7 photo fish, inline object-inline.svg, DEMO_OBJECTS.md). SVG is inlined in index.html as svg.cf-demo-object;
   state is toggled via root classes driven by the demo's existing controls. Simulation only. No network. */
(function(){var root=document.querySelector(".cfd-device"),st=document.getElementById("cf-stage");if(!root||!st)return;
var svg=st.querySelector("svg.cf-demo-object"),h=root.querySelector(".cfd-header");
function on(l){var b=[].filter.call(root.querySelectorAll(".cfd-toggle"),function(x){return x.textContent===l})[0];return !!b&&b.getAttribute("aria-pressed")==="true";}
function num(s){var e=typeof s==="string"?root.querySelector(s):s;return e?parseFloat(e.textContent):NaN;}
function gauge(i){return num(root.querySelectorAll(".cfd-gauge-value")[i]);}
/* Fish loop (Design WIRING.md): root ships "swim-on" (autoplay). "swim-off" pauses all anim; removing "swim-on" hides fish off-stage. */
if(!svg.classList.contains("swim-on"))svg.classList.add("swim-on");
if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)svg.classList.add("swim-off");
window.cfSwim=function(v){svg.classList.toggle("swim-off",v===false||v==="pause");svg.classList.toggle("swim-on",v!=="hide");};
function C(c,v){svg.classList.toggle(c,!!v);}
function W(k){var w=svg.querySelector("#water");if(w)w.style.transform="scaleY("+k.toFixed(2)+")";}
function UPDATE(){var L=on("Main light")||on("Refugium light"),H=on("Heater"),P=on("Return")||on("Powerhead 1")||on("Powerhead 2"),t=gauge(0);
C("light-on",L);C("heater-on",H);C("pump-on",P);W(1);
return "Tank "+(isNaN(t)?"":t.toFixed(1)+" °F")+": lights "+(L?"on":"off")+", heater "+(H?"on":"off")+", flow "+(P?"on":"paused")+".";}
var last="";function tick(){var t=UPDATE();if(t!==last){st.querySelector(".stage-cap").textContent=t;svg.setAttribute("aria-label",t);last=t;}}tick();setInterval(tick,250);
})();

/* Report content height to the product-page iframe shell so it never clips (James 2026-10-26). */
(function(){if(window.parent===window)return;function s(){try{window.parent.postMessage({cfDemoHeight:Math.ceil((document.querySelector('.cfd-device')||document.body).getBoundingClientRect().bottom+window.scrollY+12)},'*')}catch(e){}}
window.addEventListener('load',s);window.addEventListener('resize',s);if(window.ResizeObserver)new ResizeObserver(s).observe(document.body);setTimeout(s,300)})();

/* Pool-style yard-bar: each card clicks the matching phone outlet toggle, and mirrors its state. */
(function(){var root=document.querySelector(".cfd-device");if(!root)return;
function T(l){return [].filter.call(root.querySelectorAll(".cfd-toggle"),function(x){return x.textContent===l})[0];}
var cards=root.querySelectorAll(".yb");
[].forEach.call(cards,function(c){c.addEventListener("click",function(){var t=T(c.dataset.t);if(t)t.click();sync();});});
function sync(){[].forEach.call(cards,function(c){var t=T(c.dataset.t),on=!!t&&t.getAttribute("aria-pressed")==="true";c.setAttribute("aria-pressed",on?"true":"false");c.querySelector(".yb-s").textContent=on?"On":"Off";});}
sync();setInterval(sync,250);})();
