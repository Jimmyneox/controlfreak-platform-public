/* Design demo object (controlfreak-design 1559d14, DEMO_OBJECTS.md). SVG is inlined in index.html as svg.cf-demo-object;
   state is toggled via root classes driven by the demo's existing controls. Simulation only. No network. */
(function(){var root=document.querySelector(".cfd-device"),st=document.getElementById("cf-stage");if(!root||!st)return;
var svg=st.querySelector("svg.cf-demo-object"),h=root.querySelector(".cfd-header");if(h&&h.nextSibling!==st)h.parentNode.insertBefore(st,h.nextSibling);
function on(l){var b=[].filter.call(root.querySelectorAll(".cfd-toggle"),function(x){return x.textContent===l})[0];return !!b&&b.getAttribute("aria-pressed")==="true";}
function num(s){var e=typeof s==="string"?root.querySelector(s):s;return e?parseFloat(e.textContent):NaN;}
function gauge(i){return num(root.querySelectorAll(".cfd-gauge-value")[i]);}
function C(c,v){svg.classList.toggle(c,!!v);}
function W(k){var w=svg.querySelector("#water");if(w)w.style.transform="scaleY("+k.toFixed(2)+")";}
function UPDATE(){var w=num("#wt"),Ch=on("Chiller"),P=on("Pump"),H=on("Heater");if(isNaN(w))w=39;
var k=Math.max(0,Math.min(1,(w-35)/(70-35)));C("chiller-on",Ch);C("power-on",Ch||P||H);C("temp-neutral",w>=60);
var wc=svg.querySelector("#water-cool");if(wc)wc.style.opacity=w>=60?"":(1-k).toFixed(2);
return "Tub: water "+Math.round(w)+" °F; chiller "+(Ch?"on":"off")+", pump "+(P?"on":"off")+", heater "+(H?"on":"off")+".";}
var last="";function tick(){var t=UPDATE();if(t!==last){st.querySelector(".stage-cap").textContent=t;svg.setAttribute("aria-label",t);last=t;}}tick();setInterval(tick,250);
})();
