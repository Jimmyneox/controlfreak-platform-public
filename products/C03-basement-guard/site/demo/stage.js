/* Physical stage: controllable object driven by the demo's existing controls. Simulation only. No network. */
(function(){var root=document.querySelector(".cfd-device");if(!root)return;
var SVG='<svg viewBox="0 0 320 170" role="img" aria-label="Sump pit with two pumps"><rect x="0" y="0" width="320" height="40" fill="#3b3f45"/><rect x="0" y="36" width="320" height="6" fill="#80868e"/><rect x="90" y="42" width="140" height="120" fill="#55504a"/><rect id="wa" x="94" y="150" width="132" height="10" fill="#3f7fb8"/><line x1="90" y1="95" x2="230" y2="95" stroke="#ff8a3d" stroke-dasharray="4 4"/><text x="236" y="98" font-size="9" fill="#ffcfa8">start 10 in</text><line x1="90" y1="60" x2="230" y2="60" stroke="#ff4d4d" stroke-dasharray="4 4"/><text x="236" y="63" font-size="9" fill="#ffb0b0">high water 16 in</text><g id="pA"><rect x="104" y="128" width="28" height="30" rx="4" fill="#c9d0d8"/><text x="112" y="147" font-size="11" fill="#222">A</text></g><g id="pB"><rect x="188" y="128" width="28" height="30" rx="4" fill="#c9d0d8"/><text x="196" y="147" font-size="11" fill="#222">B</text></g><path id="dA" class="flow" d="M118 128 V20 h-110" stroke="#9fd2ff" stroke-width="4" fill="none" stroke-dasharray="6 6" opacity="0"/><path id="dB" class="flow" d="M202 128 V20 h110" stroke="#9fd2ff" stroke-width="4" fill="none" stroke-dasharray="6 6" opacity="0"/><text id="tt" x="8" y="60" font-size="12" fill="#e8eef4"></text></svg>';
UPDATE=function(){var l=num("#lvl"),A=on("Pump A"),B=on("Pump B"),pa=root.querySelector("#pa"),pb=root.querySelector("#pb");if(isNaN(l))l=6;
function running(e){return e&&/run|pump/i.test(e.textContent)&&/running|pumping|on\b/i.test(e.textContent);}
var rA=A&&running(pa),rB=B&&running(pb),y=162-Math.max(0,Math.min(18,l))*(102/18);
S("wa").setAttribute("y",y);S("wa").setAttribute("height",160-y);S("wa").style.fill=l>=16?"#c0504d":(l>=10?"#4f8fd0":"#3f7fb8");
vis("dA",rA);vis("dB",rB);cls("run",rA||rB);S("pA").style.opacity=A?1:.35;S("pB").style.opacity=B?1:.35;
S("tt").textContent="Pit "+l.toFixed(1)+" in";
return "Sump pit: water "+l.toFixed(1)+" in"+(l>=16?" — HIGH WATER":"")+"; Pump A "+(A?(rA?"running":"ready"):"outlet off")+", Pump B "+(B?(rB?"running":"ready"):"outlet off")+".";};

function on(l){var b=[].filter.call(root.querySelectorAll(".cfd-toggle"),function(x){return x.textContent===l})[0];return !!b&&b.getAttribute("aria-pressed")==="true";}
function num(s){var e=typeof s==="string"?root.querySelector(s):s;return e?parseFloat(e.textContent):NaN;}
function gauge(i){return num(root.querySelectorAll(".cfd-gauge-value")[i]);}
var st=document.createElement("figure");st.className="stage";st.innerHTML=SVG+'<figcaption class="stage-cap" aria-live="polite"></figcaption>';
var h=root.querySelector(".cfd-header");h.parentNode.insertBefore(st,h.nextSibling);
function S(id){return st.querySelector("#"+id)}function vis(id,v){var e=S(id);if(e)e.style.opacity=v?1:0;}
function cls(c,v){st.classList.toggle(c,!!v)}
var last="";setInterval(function(){var t=UPDATE();if(t!==last){st.querySelector(".stage-cap").textContent=t;st.querySelector("svg").setAttribute("aria-label",t);last=t;}},250);
})();
