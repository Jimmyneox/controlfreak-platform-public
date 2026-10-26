/* Design demo object (controlfreak-design 1559d14, DEMO_OBJECTS.md). SVG is inlined in index.html as svg.cf-demo-object;
   state is toggled via root classes driven by the demo's existing controls. Simulation only. No network. */
(function(){var root=document.querySelector(".cfd-device"),st=document.getElementById("cf-stage");if(!root||!st)return;
var svg=st.querySelector("svg.cf-demo-object"),h=root.querySelector(".cfd-header");if(h&&h.nextSibling!==st)h.parentNode.insertBefore(st,h.nextSibling);
function on(l){var b=[].filter.call(root.querySelectorAll(".cfd-toggle"),function(x){return x.textContent===l})[0];return !!b&&b.getAttribute("aria-pressed")==="true";}
function num(s){var e=typeof s==="string"?root.querySelector(s):s;return e?parseFloat(e.textContent):NaN;}
function gauge(i){return num(root.querySelectorAll(".cfd-gauge-value")[i]);}
function C(c,v){svg.classList.toggle(c,!!v);}
function W(k){var w=svg.querySelector("#water");if(w)w.style.transform="scaleY("+k.toFixed(2)+")";}
function UPDATE(){var l=num("#lvl"),A=on("Pump A"),B=on("Pump B"),pa=root.querySelector("#pa"),pb=root.querySelector("#pb");if(isNaN(l))l=6;
function running(e){return !!e&&/running|pumping|on\b/i.test(e.textContent);}
var rA=A&&running(pa),rB=B&&running(pb),k=Math.max(.05,Math.min(1,l/18));
C("pump1-on",rA);C("pump2-on",rB);C("alarm",l>=16);W(k);var f=svg.querySelector("#float");if(f)f.style.transform="translateY("+((1-k)*40).toFixed(1)+"px)";
return "Sump pit: water "+l.toFixed(1)+" in"+(l>=16?" — HIGH WATER":"")+"; Pump A "+(A?(rA?"running":"ready"):"outlet off")+", Pump B "+(B?(rB?"running":"ready"):"outlet off")+".";}
var last="";function tick(){var t=UPDATE();if(t!==last){st.querySelector(".stage-cap").textContent=t;svg.setAttribute("aria-label",t);last=t;}}tick();setInterval(tick,250);
})();
