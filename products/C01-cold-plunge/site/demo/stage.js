/* Physical stage: controllable object driven by the demo's existing controls. Simulation only. No network. */
(function(){var root=document.querySelector(".cfd-device");if(!root)return;
var SVG='<svg viewBox="0 0 320 170" role="img" aria-label="Cold plunge tub"><path d="M30 50 h260 l-14 100 h-232z" fill="#d9dee4"/><path id="wa" d="M40 64 h240 l-11 78 h-218z" fill="#4aa3e0"/><path id="ice" d="M40 64 h240" stroke="#ffffff" stroke-width="4" opacity="0"/><path id="steam" d="M110 44 q-8-12 0-24 M160 44 q-8-12 0-24 M210 44 q-8-12 0-24" stroke="#ffd9c2" stroke-width="3" fill="none" opacity="0"/><path id="fl" class="flow" d="M50 130 h220" stroke="#e6f6ff" stroke-width="2" stroke-dasharray="6 6" opacity="0"/><rect x="292" y="95" width="24" height="50" rx="4" fill="#5b6672"/><circle id="chl" cx="304" cy="105" r="4" fill="#5ad1ff" opacity="0"/><circle id="hl" cx="304" cy="118" r="4" fill="#ff7a3d" opacity="0"/><text x="292" y="160" font-size="9" fill="#cfd8e3">chiller</text><text id="tt" x="40" y="165" font-size="12" fill="#e8f1fa"></text></svg>';
UPDATE=function(){var w=num("#wt"),tg=parseFloat((root.querySelector("#tgt")||{}).textContent.replace(/[^0-9.]/g,""))||39,Ch=on("Chiller"),P=on("Pump"),H=on("Heater"),flow=!(root.querySelector("#flp")||{classList:{contains:function(){return false}}}).classList.contains("alarm");
if(isNaN(w))w=39;var k=Math.max(0,Math.min(1,(w-35)/(104-35)));
var c="rgb("+Math.round(70+k*170)+","+Math.round(170-k*40)+","+Math.round(235-k*150)+")";S("wa").style.fill=c;
var ready=Math.abs(w-tg)<=2;vis("ice",w<=45&&ready);vis("steam",w>=90);vis("fl",P&&flow);cls("run",P&&flow);vis("chl",Ch);vis("hl",H);
S("tt").textContent=Math.round(w)+"°F water · "+(ready?"ready":"getting to "+tg+"°F");
return "Tub: water "+Math.round(w)+" °F, "+(ready?"ready":"not ready yet")+"; pump "+(P?"on":"off")+(flow?"":" (no flow)")+", chiller "+(Ch?"on":"off")+", heater "+(H?"on":"off")+".";};

function on(l){var b=[].filter.call(root.querySelectorAll(".cfd-toggle"),function(x){return x.textContent===l})[0];return !!b&&b.getAttribute("aria-pressed")==="true";}
function num(s){var e=typeof s==="string"?root.querySelector(s):s;return e?parseFloat(e.textContent):NaN;}
function gauge(i){return num(root.querySelectorAll(".cfd-gauge-value")[i]);}
var st=document.createElement("figure");st.className="stage";st.innerHTML=SVG+'<figcaption class="stage-cap" aria-live="polite"></figcaption>';
var h=root.querySelector(".cfd-header");h.parentNode.insertBefore(st,h.nextSibling);
function S(id){return st.querySelector("#"+id)}function vis(id,v){var e=S(id);if(e)e.style.opacity=v?1:0;}
function cls(c,v){st.classList.toggle(c,!!v)}
var last="";setInterval(function(){var t=UPDATE();if(t!==last){st.querySelector(".stage-cap").textContent=t;st.querySelector("svg").setAttribute("aria-label",t);last=t;}},250);
})();
