/* Design demo object (controlfreak-design 0738ffa close-up, inline object-inline.svg, DEMO_OBJECTS.md). SVG is inlined in index.html as svg.cf-demo-object;
   state is toggled via root classes driven by the demo's existing controls. Simulation only. No network. */
(function(){var root=document.querySelector(".cfd-device"),st=document.getElementById("cf-stage");if(!root||!st)return;
var svg=st.querySelector("svg.cf-demo-object"),h=root.querySelector(".cfd-header");
function on(l){var b=[].filter.call(root.querySelectorAll(".cfd-toggle"),function(x){return x.textContent===l})[0];return !!b&&b.getAttribute("aria-pressed")==="true";}
function num(s){var e=typeof s==="string"?root.querySelector(s):s;return e?parseFloat(e.textContent):NaN;}
function gauge(i){return num(root.querySelectorAll(".cfd-gauge-value")[i]);}
function C(c,v){svg.classList.toggle(c,!!v);}
function W(k){var w=svg.querySelector("#water");if(w)w.style.transform="scaleY("+k.toFixed(2)+")";}
function UPDATE(){var D=on("Day light"),U=on("UVB"),Ht=on("Basking lamp")||on("Ceramic emitter")||on("Heat mat"),Mi=on("Mister");
C("lamp-on",D);C("uvb-on",U);C("heat-on",Ht);C("mist-on",Mi);
return "Enclosure: lights "+(D?"on":"off")+", UVB "+(U?"on":"off")+", heat "+(Ht?"on":"off")+", mist "+(Mi?"on":"off")+".";}
var last="";function tick(){var t=UPDATE();if(t!==last){st.querySelector(".stage-cap").textContent=t;svg.setAttribute("aria-label",t);last=t;}}tick();setInterval(tick,250);
})();
