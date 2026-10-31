/* Basement Guard Pro demo layer. Fake, client-side only. No network. */
(function(){var root=document.querySelector(".cfd-device");if(!root)return;
var toast=root.querySelector(".cfd-toast"),tm;function say(m){toast.textContent=m;toast.classList.add("show");clearTimeout(tm);tm=setTimeout(function(){toast.classList.remove("show")},4200);}
function Q(s){return root.querySelector(s)}function out(l){return [].filter.call(root.querySelectorAll(".cfd-toggle"),function(b){return b.textContent===l})[0]}
function set(l,on){var b=out(l);if(b)b.setAttribute("aria-pressed",!!on)}
function pill(id,cls,txt){var e=Q(id);e.className="x-pill "+cls;e.querySelector("b").textContent=txt}
var lead="A",lv=6,busy=0,R=Q("#ring"),C=2*Math.PI*50;R.style.strokeDasharray=C;
function draw(r){Q("#lvl").textContent=lv.toFixed(1);R.style.strokeDashoffset=C*(1-Math.min(lv,16)/16);R.style.stroke=lv>=14?"#e5484d":lv>=10?"#f5a524":"#2f7cf6";if(r!==undefined)Q("#rate").textContent=r;}
draw();var other=function(){return lead==="A"?"B":"A"};
function roles(){pill("#pa",lead==="A"?"":"off","Pump A "+(lead==="A"?"Lead":"Standby"));pill("#pb",lead==="B"?"":"off",lead==="B"?"Lead":"Standby");Q("#pa").firstChild.textContent="Pump A ";Q("#pa").querySelector("b").textContent=lead==="A"?"Lead":"Standby";Q("#pb").querySelector("b").textContent=lead==="B"?"Lead":"Standby";}
Q("#storm").onclick=function(){if(busy)return;busy=1;var t=0,second=0;say("SIMULATED · Storm: pit rising +1 in/min (example).");
 var iv=setInterval(function(){t++;
  if(t<=8){lv+=1.2;draw("rising ↑ 1.2 in/min");if(lv>=10&&t<6){Q("#pa").querySelector("b").textContent="Pump "+lead+" running";}}
  if(t===6){Q("#st").textContent="Lead pump running · water still rising";}
  if(t===8&&!second){second=1;Q("#st").textContent="Second pump stepped in (after a short stagger)";say("SIMULATED · Second pump stepped in after a short delay, never both at the same moment. Note sent.");pill("#pb","warn","Running · stepped in");}
  if(t>8){lv-=1.6;draw("falling ↓");}
  if(lv<=6&&t>8){lv=6;draw("steady");clearInterval(iv);busy=0;roles();Q("#st").textContent="Pit at 6 in · storm handled · both pumps healthy";say("SIMULATED · Pit back to 6 in. Both pumps healthy.");}
 },700);};
Q("#test").onclick=function(){say("SIMULATED · Weekly test: Pump "+lead+" runs…");setTimeout(function(){say("SIMULATED · Pump "+lead+" OK. Now Pump "+other()+"…")},1400);setTimeout(function(){say("SIMULATED · Weekly pump test: both pumps OK.");pill("#ph","","Both healthy · tested just now")},2800);};
Q("#swap").onclick=function(){lead=other();roles();say("SIMULATED · Lead swapped: Pump "+lead+" is up this week. (It swaps weekly on its own.)");};
Q("#cold").onclick=function(){var g=root.querySelectorAll(".cfd-gauge-value")[1];var t=41,iv=setInterval(function(){t-=2;if(g)g.textContent=t+"°F";if(t<=33){clearInterval(iv);set("Heat tape",true);pill("#ht","","Heat tape On · crawlspace "+t+" °F");say("SIMULATED · Cold snap: crawlspace "+t+" °F, heat tape switched on.");}},500);};
var A=["High water: pit at 15 in, siren sounding in the house","Pump didn’t empty the pit: Pump A ran but level held","Slow pump-down: Pump A emptied the pit slower than usual; plan a replacement","Leak: water heater sensor is wet","Freezing pipes: crawlspace 33 °F"],ai=0;
Q("#alert").onclick=function(){var a=A[ai++%A.length];if(a.indexOf("Slow")===0)pill("#ph","warn","Pump A slower than usual");say("SIMULATED ALERT · 🔔 "+a+": push · text · email · alarm. Example only.");};
Q("#lk").onclick=function(){var e=Q("#lkp"),on=!e.classList.contains("alarm");e.className="x-pill "+(on?"alarm":"");e.querySelector("b").textContent=on?"WET (what if)":"Dry";say(on?"SIMULATED WHAT-IF · Leak at the water heater. Siren + push · text · email · alarm. Tap again to clear.":"SIMULATED · Leak sensors dry.");};
})();
