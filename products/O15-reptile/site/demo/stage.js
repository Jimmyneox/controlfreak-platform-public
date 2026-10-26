/* Physical stage: controllable object driven by the demo's existing controls. Simulation only. No network. */
(function(){var root=document.querySelector(".cfd-device");if(!root)return;
var SVG='<svg viewBox="0 0 320 170" role="img" aria-label="Terrarium"><rect x="20" y="8" width="280" height="14" rx="3" fill="#3a3a33"/><rect id="day" x="30" y="10" width="200" height="8" rx="2" fill="#fff6c8" opacity="0"/><circle id="bask" cx="255" cy="15" r="8" fill="#ffb14a" opacity="0"/><rect id="bg" x="20" y="22" width="280" height="130" fill="#20302a"/><polygon id="glow" points="245,22 265,22 300,140 210,140" fill="#ffcf6a" opacity="0"/><rect id="uvb" x="40" y="22" width="180" height="4" fill="#c79bff" opacity="0"/><rect id="mat" x="20" y="148" width="140" height="6" fill="#ff6a3d" opacity="0"/><path d="M20 150 q70-14 140 0 t140-4 v6 h-280z" fill="#8a6b45"/><rect x="215" y="118" width="70" height="16" rx="8" fill="#6d5a48"/><path d="M228 118 q10-10 22-2 l12-2 -6 6 q-14 6-28-2z" fill="#6aa04a"/><path d="M50 150 v-40 m10 40 v-55 m10 55 v-35" stroke="#3d8f7a" stroke-width="4"/><g id="mist" opacity="0" fill="#e8f2ff"><circle class="bub" cx="80" cy="40" r="4" style="animation-direction:reverse"/><circle class="bub" cx="120" cy="45" r="3" style="animation-direction:reverse;animation-delay:.7s"/><circle class="bub" cx="160" cy="40" r="5" style="animation-direction:reverse;animation-delay:1.4s"/></g><g id="fan" opacity="0"><path class="flow" d="M290 60 h-40 M290 75 h-40" stroke="#cfe" stroke-width="2" stroke-dasharray="5 5"/></g><rect x="20" y="22" width="280" height="132" rx="4" fill="none" stroke="#9aa59a" stroke-width="3"/><text id="tt" x="26" y="166" font-size="11" fill="#e6e0cc"></text></svg>';
UPDATE=function(){var D=on("Day light"),B=on("Basking lamp"),U=on("UVB"),M=on("Heat mat"),C=on("Ceramic emitter"),Mi=on("Mister"),Fa=on("Fan"),g=root.querySelectorAll(".grad b"),bt=num(g[2]);
vis("day",D);vis("bask",B||C);vis("glow",B?Math.min(.6,Math.max(.15,((bt||100)-80)/50)):(C?.12:0));vis("uvb",U?.7:0);vis("mat",M);vis("mist",Mi);vis("fan",Fa);cls("run",Fa);
S("bg").style.fill=D?"#4c6f55":"#1a2430";
S("tt").textContent="Cool "+(g[0]?g[0].textContent:"")+" · Hot "+(g[1]?g[1].textContent:"")+" · Basking "+(g[2]?g[2].textContent:"");
return "Enclosure: "+(D?"day light on":"lights off")+", basking "+(B?"on":"off")+", heat mat "+(M?"on":"off")+", mist "+(Mi?"on":"off")+", fan "+(Fa?"on":"off")+".";};

function on(l){var b=[].filter.call(root.querySelectorAll(".cfd-toggle"),function(x){return x.textContent===l})[0];return !!b&&b.getAttribute("aria-pressed")==="true";}
function num(s){var e=typeof s==="string"?root.querySelector(s):s;return e?parseFloat(e.textContent):NaN;}
function gauge(i){return num(root.querySelectorAll(".cfd-gauge-value")[i]);}
var st=document.createElement("figure");st.className="stage";st.innerHTML=SVG+'<figcaption class="stage-cap" aria-live="polite"></figcaption>';
var h=root.querySelector(".cfd-header");h.parentNode.insertBefore(st,h.nextSibling);
function S(id){return st.querySelector("#"+id)}function vis(id,v){var e=S(id);if(e)e.style.opacity=v?1:0;}
function cls(c,v){st.classList.toggle(c,!!v)}
var last="";setInterval(function(){var t=UPDATE();if(t!==last){st.querySelector(".stage-cap").textContent=t;st.querySelector("svg").setAttribute("aria-label",t);last=t;}},250);
})();
