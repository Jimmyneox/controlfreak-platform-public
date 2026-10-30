/* Terrarium Control Pro demo layer. Fake, client-side only. No network. */
(function(){var root=document.querySelector(".cfd-device");if(!root)return;
var toast=root.querySelector(".cfd-toast"),tm;function say(m){toast.textContent=m;toast.classList.add("show");clearTimeout(tm);tm=setTimeout(function(){toast.classList.remove("show")},4200);}
function Q(s){return root.querySelector(s)}function out(l){return [].filter.call(root.querySelectorAll(".cfd-toggle"),function(b){return b.textContent===l})[0]}
function set(l,on){var b=out(l);if(b)b.setAttribute("aria-pressed",!!on)}
function pill(id,cls,txt){var e=Q(id);e.className="x-pill "+cls;e.querySelector("b").textContent=txt}
var Z=[{v:78,s:78,n:72},{v:92,s:92,n:80},{v:105,s:105,n:0}],night=false,heat=["Heat mat","Ceramic emitter","Basking lamp"];
var bs=root.querySelectorAll(".grad button");
function paint(){Z.forEach(function(z,i){var b=bs[i];b.querySelector("b").textContent=Math.round(z.v)+"°F";b.querySelector("i").textContent=(i==2&&night)?"off at night":"set "+(night?z.n:z.s);});}
setInterval(function(){Z.forEach(function(z){var t=night?z.n||70:z.s;z.v+=(t-z.v)*.25+(Math.random()-.5)*.3;});paint();},900);
[].forEach.call(bs,function(b){b.onclick=function(){var z=Z[+b.dataset.i];z.s+=2;if(z.s>z.n+40)z.s-=8;paint();say("SIMULATED · "+b.querySelector("small").textContent+" setpoint → "+z.s+" °F. Reading eases toward it.");};});
function dn(n){night=n;Q("#dn").textContent=n?"Night · tap for day":"Day · tap for night";Q("#dn").setAttribute("aria-pressed",n);Q("#night").setAttribute("aria-pressed",n);["Basking lamp","UVB","Day light"].forEach(function(l){set(l,!n)});Q("#st").textContent=n?"Night · 22:00 · lights off, night setpoints":"Day · 14:00 · all enclosures on setpoint";paint();}
Q("#dn").onclick=function(){dn(!night);say("SIMULATED · "+(night?"Night: lights off, setpoints drop to night values.":"Day: lights on, day setpoints."));};
Q("#night").onclick=function(){dn(!night);say("SIMULATED · Night mode "+(night?"on":"off")+".");};
/* Day and Night cues (built-in tiles 0 and 1) also switch the night setpoints. */
root.addEventListener("cfd:cue",function(e){var i=e.detail.index;if(i===0&&night)dn(false);if(i===1&&!night)dn(true);});
Q("#away").onclick=function(){var a=Q("#away"),on=a.getAttribute("aria-pressed")!=="true";a.setAttribute("aria-pressed",on);say("SIMULATED · Away mode "+(on?"on — schedules keep running; alerts go to your phone wherever you are.":"off."));};
Q("#door").onclick=function(){var d=Q("#door"),on=d.getAttribute("aria-pressed")!=="true";d.setAttribute("aria-pressed",on);set("Mister",false);set("Fan",!on);pill("#mist",on?"warn":"",on?"Paused · door open":"Next 18:00");say("CONCEPT · SIMULATED · Door "+(on?"open: misting and fan paused while you feed.":"closed: misting and fan resume."));};
Q("#alert").onclick=function(){Z[2].v=112;paint();set("Basking lamp",false);bs[2].classList.add("hot");setTimeout(function(){bs[2].classList.remove("hot")},4000);say("SIMULATED ALERT · Basking spot 112 °F — above your limit. Basking lamp outlet switched off. Push · text · email · alarm. Example only.");};
})();
