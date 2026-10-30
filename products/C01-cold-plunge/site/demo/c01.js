/* Cold Plunge Control Pro demo layer. Fake, client-side only. No network. */
(function(){var root=document.querySelector(".cfd-device");if(!root)return;
var toast=root.querySelector(".cfd-toast"),tm;function say(m){toast.textContent=m;toast.classList.add("show");clearTimeout(tm);tm=setTimeout(function(){toast.classList.remove("show")},4200);}
function Q(s){return root.querySelector(s)}function out(l){return [].filter.call(root.querySelectorAll(".cfd-toggle"),function(b){return b.textContent===l})[0]}
function set(l,on){var b=out(l);if(b)b.setAttribute("aria-pressed",!!on)}
function pill(id,cls,txt){var e=Q(id);e.className="x-pill "+cls;e.querySelector("b").textContent=txt}
var R=Q("#ring"),C=2*Math.PI*50,w=39,tg=39,times=["6:30","6:00","7:00","5:45"],ti=0,starts={"6:30":"4:50","6:00":"4:20","7:00":"5:20","5:45":"4:05"};R.style.strokeDasharray=C;
function draw(){Q("#wt").textContent=Math.round(w);var p=Math.max(0,Math.min(1,(70-w)/(70-tg)));R.style.strokeDashoffset=C*(1-p);R.style.stroke=w>tg+3?"#d98a00":"#0b4f8a";}
draw();
Q("#rb").onclick=function(){ti=(ti+1)%times.length;var t=times[ti];Q("#rbt").textContent=t;Q("#cool").textContent="starts cooling at "+starts[t]+" (example)";Q("#st").textContent=Math.round(w)+" °F · ready at "+t+" · flow OK";say("SIMULATED · Ready by "+t+": chiller starts at "+starts[t]+" so the water hits "+tg+" °F on time.");};
function flow(ok){pill("#flp",ok?"":"alarm",ok?"OK":"No flow");set("Chiller",ok);pill("#ch",ok?"":"off",ok?"Running":"Stopped · no flow");Q("#st").textContent=ok?Math.round(w)+" °F · ready at "+times[ti]+" · flow OK":"Flow stopped · chiller off to protect it";}
Q("#fl").onclick=function(){var ok=Q("#flp").classList.contains("alarm");flow(ok);say(ok?"SIMULATED · Flow restored, chiller back on.":"SIMULATED WHAT-IF · No flow — chiller stopped so it can’t run dry. Alert sent.");};
Q("#clog").onclick=function(){pill("#flt","warn","Pressure rising · clean soon");say("SIMULATED · Filter pressure rising — clean the filter soon.");setTimeout(function(){flow(false);say("SIMULATED ALERT · Flow low — chiller stopped safely. Clean the filter, then tap Flow to clear.");},2200);};
Q("#cold").onclick=function(){var g=root.querySelector(".cfd-gauge-value");var a=46,iv=setInterval(function(){a-=3;if(g)g.textContent=a+"°F";if(a<=31){clearInterval(iv);set("Pump",true);pill("#wm","","On · air "+a+" °F · pump running");say("SIMULATED · Cold night: air "+a+" °F — winter mode runs the pump to protect the tub and pipes.");}},450);};
Q("#hc").onclick=function(){var b=Q("#hc"),hot=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",hot);set("Heater",hot);set("Chiller",!hot);tg=hot?102:plungeT;Q("#tgt").textContent="target "+tg+" °F";
 var iv=setInterval(function(){w+=(tg-w)*.3;draw();if(Math.abs(tg-w)<1){w=tg;draw();clearInterval(iv);}},300);say("SIMULATED · "+(hot?"Warm soak: heater outlet on, chiller off. Target 102 °F (example).":"Back to plunge: heater off, chiller on. Target 39 °F."));};
/* Cues carry each person's water target (Plunge 39 °F, Sam 45 °F...). */
var plungeT=39;root.addEventListener("cfd:cue",function(e){if(e.detail.target==null)return;plungeT=e.detail.target;if(Q("#hc").getAttribute("aria-pressed")==="true")return;
 tg=plungeT;Q("#tgt").textContent="target "+tg+" °F";var iv=setInterval(function(){w+=(tg-w)*.3;draw();if(Math.abs(tg-w)<1){w=tg;draw();clearInterval(iv);}},300);});
var A=["Water too warm — 45 °F at your ready-by time","No flow — chiller stopped","Filter — clean soon","Cold night — winter mode running the pump","Chiller health — cooling slower than usual"],ai=0;
Q("#alert").onclick=function(){var a=A[ai++%A.length];if(a.indexOf("Chiller")===0)pill("#hl","warn","Cooling slower than usual");say("SIMULATED ALERT · "+a+" — push · text · email · alarm. Example only.");};
})();
