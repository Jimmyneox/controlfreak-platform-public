/* Physical stage: controllable object driven by the demo's existing controls. Simulation only. No network. */
(function(){var root=document.querySelector(".cfd-device");if(!root)return;
var SVG='<svg viewBox="0 0 320 170" role="img" aria-label="Reef tank"><rect x="20" y="10" width="280" height="12" rx="3" fill="#2a2f36"/><rect id="lg" x="30" y="22" width="260" height="120" fill="#bfe6ff" opacity="0"/><rect x="20" y="22" width="280" height="125" rx="4" fill="none" stroke="#9fb3c4" stroke-width="3"/><rect id="wa" x="22" y="34" width="276" height="111" fill="#1d5f8a"/><rect id="ref" x="22" y="34" width="276" height="111" fill="#7a3fd1" opacity="0"/><path d="M40 145 q10-30 20 0 M70 145 q8-40 16 0 M230 145 q12-35 24 0" stroke="#ff7a5c" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M22 145 h276 v-8 q-60-6-138 0 t-138 0z" fill="#d8c79a"/><g id="fish" fill="#ffb347"><path d="M150 80 l18-8 v16z M150 80 q-14-10-26 0 q12 10 26 0"/></g><path id="ph1" class="flow" d="M40 60 h70" stroke="#e8f6ff" stroke-width="2" stroke-dasharray="6 6" opacity="0"/><path id="ph2" class="flow" d="M280 70 h-70" stroke="#e8f6ff" stroke-width="2" stroke-dasharray="6 6" opacity="0"/><g id="ret" opacity="0"><circle class="bub" cx="270" cy="135" r="3" fill="#fff"/><circle class="bub" cx="276" cy="140" r="2" fill="#fff" style="animation-delay:.8s"/><circle class="bub" cx="265" cy="140" r="2.5" fill="#fff" style="animation-delay:1.6s"/></g><rect id="ht" x="294" y="60" width="5" height="60" rx="2" fill="#ff5a36" opacity="0"/><rect id="fan" x="250" y="2" width="30" height="8" rx="2" fill="#7fd3ff" opacity="0"/><text id="tt" x="30" y="165" font-size="11" fill="#cfe3f2"></text></svg>';
UPDATE=function(){var L=on("Main light"),R=on("Refugium light"),p1=on("Powerhead 1"),p2=on("Powerhead 2"),r=on("Return"),H=on("Heater"),F=on("Chiller/fan"),t=gauge(0);
vis("lg",L?.35:0);vis("ref",R?.25:0);vis("ph1",p1);vis("ph2",p2);vis("ret",r);vis("ht",H);vis("fan",F);cls("run",p1||p2||r);
var w=isNaN(t)?78:t;S("wa").style.fill=w>=80.5?"#3f6f7a":(w<=76?"#1a4f9a":"#1d5f8a");S("wa").style.opacity=L?.75:.95;
S("fish").setAttribute("transform","translate("+(Math.sin(Date.now()/1500)*40)+",0)");
S("tt").textContent="Tank "+(isNaN(t)?"—":t.toFixed(1)+"°F");
return "Tank: lights "+(L?"on":"off")+", refugium "+(R?"on":"off")+", flow "+((p1||p2||r)?"on":"paused")+", heater "+(H?"on":"off")+", fan "+(F?"on":"off")+".";};

function on(l){var b=[].filter.call(root.querySelectorAll(".cfd-toggle"),function(x){return x.textContent===l})[0];return !!b&&b.getAttribute("aria-pressed")==="true";}
function num(s){var e=typeof s==="string"?root.querySelector(s):s;return e?parseFloat(e.textContent):NaN;}
function gauge(i){return num(root.querySelectorAll(".cfd-gauge-value")[i]);}
var st=document.createElement("figure");st.className="stage";st.innerHTML=SVG+'<figcaption class="stage-cap" aria-live="polite"></figcaption>';
var h=root.querySelector(".cfd-header");h.parentNode.insertBefore(st,h.nextSibling);
function S(id){return st.querySelector("#"+id)}function vis(id,v){var e=S(id);if(e)e.style.opacity=v?1:0;}
function cls(c,v){st.classList.toggle(c,!!v)}
var last="";setInterval(function(){var t=UPDATE();if(t!==last){st.querySelector(".stage-cap").textContent=t;st.querySelector("svg").setAttribute("aria-label",t);last=t;}},250);
})();
