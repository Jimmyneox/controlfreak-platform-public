/* Reef extensions: feed/maintenance mode, dosing next-dose, sample alerts. Fake, client-side only. */
(function(){
  var root=document.querySelector(".cfd-device"); if(!root) return;
  var toast=root.querySelector(".cfd-toast"), timer;
  function say(m){toast.textContent=m;toast.classList.add("show");clearTimeout(timer);timer=setTimeout(function(){toast.classList.remove("show")},3800);}
  var pumps=["Return","PH1","PH2","Skimmer"];
  function btn(label){return [].filter.call(root.querySelectorAll(".cfd-toggle"),function(b){return b.textContent===label})[0];}
  var saved={}, modeT, left=0;
  function setMode(name,mins,el,other){
    var on=el.getAttribute("aria-pressed")!=="true";
    if(other.getAttribute("aria-pressed")==="true") resume(other);
    if(!on){resume(el);return;}
    el.setAttribute("aria-pressed","true");
    pumps.forEach(function(p){var b=btn(p);if(!b)return;saved[p]=b.getAttribute("aria-pressed");b.setAttribute("aria-pressed","false");b.classList.add("paused");});
    left=mins*60; el.dataset.label=el.textContent;
    clearInterval(modeT); modeT=setInterval(function(){left-=15; el.textContent=name+" · "+Math.ceil(left/60)+" min left (tap to resume)"; if(left<=0) resume(el);},1000);
    el.textContent=name+" · "+mins+" min left (tap to resume)";
    say("SIMULATED · "+name+" mode: return, powerheads and skimmer paused. Auto-resume in "+mins+" min.");
  }
  function resume(el){clearInterval(modeT);el.setAttribute("aria-pressed","false");if(el.dataset.label)el.textContent=el.dataset.label;
    pumps.forEach(function(p){var b=btn(p);if(!b)return;if(saved[p]!=null)b.setAttribute("aria-pressed",saved[p]);b.classList.remove("paused");});saved={};
    say("SIMULATED · Pumps resumed.");}
  var feed=root.querySelector("#rf-feed"), maint=root.querySelector("#rf-maint");
  feed.onclick=function(){setMode("Feed",10,feed,maint)};
  maint.onclick=function(){setMode("Maintenance",30,maint,feed)};
  var doses={Ca:["Calcium","8 ml","in 42 min"],Alk:["Alkalinity","8 ml","in 1 h 12 min"],Mg:["Magnesium","3 ml","in 3 h 05 min"]};
  [].forEach.call(root.querySelectorAll(".rf-chip"),function(c){c.onclick=function(){var d=doses[c.dataset.dose];say("SIMULATED · "+d[0]+": next dose "+d[1]+" "+d[2]+" (example schedule).");};});
  var alerts=["High temp — tank above your limit; heater switched off","ATO lockout — overfill protection stopped top-off","Leak detected — floor sensor is wet"], ai=0;
  root.querySelector("#rf-alert").onclick=function(){say("SIMULATED ALERT · "+alerts[ai++%alerts.length]+" — example only");};
})();
