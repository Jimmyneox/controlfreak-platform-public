/* Control Freak demo chrome — fake, client-side only. No network. */
(function(){
  var C = window.CFD_CONFIG || {
    product:"PLACEHOLDER Product",
    readouts:[
      {label:"Readout A (placeholder)",unit:"",min:0,max:100,value:52,jitter:1.5},
      {label:"Readout B (placeholder)",unit:"%",min:0,max:100,value:40,jitter:2},
      {label:"Readout C (placeholder)",unit:"",min:0,max:10,value:6,jitter:.2},
      {label:"Readout D (placeholder)",unit:"",min:0,max:1000,value:320,jitter:8}],
    controls:[{label:"Control 1",on:true},{label:"Control 2",on:false},{label:"Control 3",on:false},{label:"Control 4",on:true}],
    notify:{label:"Simulated alert",channels:["Push","Text","Email","Alarm"]},
    cues:[{name:"Normal",icon:"sun"},{name:"Cue 2",icon:"moon",set:{"Control 1":false},dur:{"Control 1":5}},{name:"Service",icon:"wrench",set:{"Control 1":false,"Control 4":false}}]
  };
  document.querySelectorAll(".cfd-device").forEach(function(root){
    var q=function(s){return root.querySelector(s)};
    q(".cfd-product").textContent=C.product;
    var R=q(".cfd-readouts"), K=q(".cfd-controls");
    var gs=C.readouts.map(function(r){
      var el=document.createElement("div");el.className="cfd-gauge";
      el.innerHTML='<div class="cfd-gauge-label"></div><div class="cfd-gauge-value"></div><div class="cfd-bar"><i></i></div>';
      el.querySelector(".cfd-gauge-label").textContent=r.label;R.appendChild(el);
      return {r:r,v:r.value,el:el};
    });
    function paint(){gs.forEach(function(g){
      var d=g.r.max-g.r.min, p=Math.max(0,Math.min(100,(g.v-g.r.min)/d*100));
      g.el.querySelector(".cfd-gauge-value").textContent=(d<=20?g.v.toFixed(1):Math.round(g.v))+(g.r.unit||"");
      g.el.querySelector("i").style.width=p+"%";});}
    function tick(){gs.forEach(function(g){
      g.v+= (Math.random()-.5)*2*g.r.jitter + (g.r.value-g.v)*.1;
      g.v=Math.max(g.r.min,Math.min(g.r.max,g.v));});paint();}
    paint(); setInterval(tick,1800);
    C.controls.forEach(function(c){
      var b=document.createElement("button");b.className="cfd-toggle";b.type="button";
      b.textContent=c.label;b.setAttribute("aria-pressed",!!c.on);
      b.onclick=function(){b.setAttribute("aria-pressed",b.getAttribute("aria-pressed")!=="true");};
      K.appendChild(b);});
    if(C.cues&&C.cues.length)cues(root,C);
    var n=q(".cfd-notify"), t=q(".cfd-toast");
    if(n&&C.notify){
      n.querySelector("span").textContent="Notification types (simulated): "+C.notify.channels.join(" · ");
      n.querySelector("button").onclick=function(){
        t.textContent="SIMULATED · "+C.notify.label+", example only";
        t.classList.add("show");setTimeout(function(){t.classList.remove("show")},3500);};
    }
  });

  /* ---------- Cues (company standard, see CUES.md) ----------
     One tap sets several outlets at once, like a home automation scene. The first cue is
     the everyday setup the others return to. Each outlet a cue changes can carry its own
     time; when it runs out, that outlet goes back to the first cue's setting, and once every
     changed outlet is timed and done the cue ends. Customers can edit cues and add their own.
     Kept in memory only. The demo clock runs 10x fast so a timer ends while someone watches.
     Config: cues:[{name,icon,set:{Label:bool},dur:{Label:minutes},target:number}], cueSkip:[labels not in cues],
     cueTarget:{label,unit,min,max,step,value} (one setting each cue carries, e.g. a water target),
     cueNewIcon (icon for a new cue, e.g. "person" for personal cues).
     Product scripts can listen for root "cfd:cue" (detail: {index,name,target}). */
  function cues(root,C){
    var ICONS={
      waves:'<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
      sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
      moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
      wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
      snowflake:'<path d="m10 20-1.25-2.5L6 18"/><path d="M10 4 8.75 6.5 6 6"/><path d="m14 20 1.25-2.5L18 18"/><path d="m14 4 1.25 2.5L18 6"/><path d="m17 21-3-6h-4"/><path d="m17 3-3 6 1.5 3"/><path d="M2 12h6.5L10 9"/><path d="m20 10-1.5 2 1.5 2"/><path d="M22 12h-6.5L14 15"/><path d="m4 10 1.5 2L4 14"/><path d="m7 21 3-6-1.5-3"/><path d="m7 3 3 6h4"/>',
      droplets:'<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',
      rain:'<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/>',
      quiet:'<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M22 9l-6 6"/><path d="M16 9l6 6"/>',
      shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
      person:'<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
      plane:'<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>'
    };
    var svg=function(k){return '<svg class="cfd-cue-ico" viewBox="0 0 24 24" aria-hidden="true">'+(ICONS[k]||ICONS.sun)+"</svg>";};
    var q=function(s){return root.querySelector(s)}, MAX=6, MINUTES=[0,1,2,5,10,15,30,60];
    var btn={}; root.querySelectorAll(".cfd-toggle").forEach(function(b){btn[b.textContent]=b;});
    var skip=C.cueSkip||[], L=C.controls.map(function(c){return c.label}).filter(function(l){return skip.indexOf(l)<0});
    var startOn={}; C.controls.forEach(function(c){startOn[c.label]=!!c.on;});
    var uid=0;
    var T=C.cueTarget||null;
    function make(name,icon,set,dur,target){var out={},d={};L.forEach(function(l){out[l]=startOn[l];d[l]=0;});
      Object.keys(set||{}).forEach(function(l){if(l in out)out[l]=!!set[l];});
      Object.keys(dur||{}).forEach(function(l){if(l in d)d[l]=+dur[l]||0;});
      return {id:"q"+(uid++),name:name,icon:icon||"sun",out:out,dur:d,target:T?(target!=null?+target:T.value):null};}
    var list=C.cues.map(function(c){return make(c.name,c.icon,c.set,c.dur,c.target);});
    var builtIn=list.map(function(c){return c.id;}), home=list[0], active=home.id, timer=null, left={}, made=0;
    var on=function(l){return btn[l]&&btn[l].getAttribute("aria-pressed")==="true";};
    var put=function(l,v){if(btn[l])btn[l].setAttribute("aria-pressed",!!v);};
    var byId=function(id){return list.filter(function(c){return c.id===id})[0];};
    var changed=function(c){return L.filter(function(l){return c.out[l]!==home.out[l];});};
    var tgt=function(c){return T&&c.target!==home.target?" "+T.label.toLowerCase()+" "+c.target+" "+T.unit+".":"";};
    var clock=function(s){return Math.floor(s/60)+":"+String(s%60).padStart(2,"0");};

    var sec=document.createElement("section");sec.className="cfd-cues";sec.setAttribute("aria-label","Cues");
    sec.innerHTML='<div class="cfd-cues-h"><span>Cues</span><button type="button" class="cfd-cue-edit" aria-haspopup="dialog">Edit</button></div>'+
      '<div class="cfd-cue-tiles" role="radiogroup" aria-label="Cues"></div><p class="cfd-cue-status" aria-live="polite"></p>';
    var after=q(".x-status")||q(".cfd-header"), at=q(".cfd-readouts")||q(".cfd-controls");
    if(after&&after.nextSibling)after.parentNode.insertBefore(sec,after.nextSibling);else at.parentNode.insertBefore(sec,at);
    var tiles=sec.querySelector(".cfd-cue-tiles"), status=sec.querySelector(".cfd-cue-status");

    function summary(c){
      if(c===home)return "Your everyday setup";
      var ks=changed(c);if(!ks.length)return T&&c.target!==home.target?T.label+" "+c.target+" "+T.unit:"Same as "+home.name;
      var ds=ks.map(function(l){return c.dur[l]});
      if(ds[0]&&ds.every(function(m){return m===ds[0]}))return ks.length+(ks.length===1?" outlet":" outlets")+", "+ds[0]+" min";
      var timed=ds.filter(Boolean).length;
      return ks.length+(ks.length===1?" outlet changes":" outlets change")+(timed?", "+timed+" timed":"");
    }
    function render(){
      tiles.textContent="";
      list.forEach(function(c){
        var l=document.createElement("label");
        l.innerHTML='<input type="radio" name="cfd-cue"><span class="cfd-cue">'+svg(c.icon)+"<b></b><small></small></span>";
        var r=l.querySelector("input");r.value=c.id;r.checked=c.id===active;
        l.querySelector("b").textContent=c.name;l.querySelector("small").textContent=summary(c);
        r.addEventListener("change",function(){if(r.checked)apply(c.id);});
        tiles.appendChild(l);});
    }
    function statusText(c){
      if(c===home)return home.name+": your everyday setup."+(T?" "+T.label+" "+c.target+" "+T.unit+".":"");
      var g=[],seen={};
      changed(c).forEach(function(l){
        var t=l in left;if(c.dur[l]&&!t)return;
        var key=(c.out[l]?"On":"Off")+(t?" for "+clock(left[l]):" until you tap "+home.name);
        if(!(key in seen)){seen[key]=g.length;g.push({key:key,n:[]});}
        g[seen[key]].n.push(l);});
      var s=g.map(function(x){return x.n.join(", ")+" "+x.key+".";}).join(" ");
      if(!s&&tgt(c))return c.name+":"+tgt(c).replace(/^ ./,function(x){return " "+x.charAt(1).toUpperCase();});
      return c.name+": "+(s||"Same as "+home.name+".")+tgt(c)+(Object.keys(left).length?" (Demo clock runs 10× fast.)":"");
    }
    function paintLeft(){L.forEach(function(l){if(!btn[l])return;if(l in left)btn[l].dataset.left=clock(left[l]);else delete btn[l].dataset.left;});}
    function apply(id){
      var c=byId(id)||home;active=c.id;
      var r=tiles.querySelector('input[value="'+c.id+'"]');if(r)r.checked=true;
      clearInterval(timer);timer=null;left={};
      L.forEach(function(l){put(l,c.out[l]);});
      var ks=changed(c);ks.forEach(function(l){if(c.dur[l])left[l]=c.dur[l]*60;});
      var allTimed=ks.length>0&&ks.every(function(l){return c.dur[l]});
      status.textContent=statusText(c);paintLeft();
      root.dispatchEvent(new CustomEvent("cfd:cue",{detail:{index:list.indexOf(c),name:c.name,target:c.target}}));
      if(!Object.keys(left).length)return;
      timer=setInterval(function(){
        if(document.hidden)return;
        Object.keys(left).forEach(function(l){left[l]=Math.max(0,left[l]-10);if(!left[l]){delete left[l];put(l,home.out[l]);}});
        if(!Object.keys(left).length){clearInterval(timer);timer=null;
          if(allTimed){apply(home.id);status.textContent=c.name+" done. Back to "+home.name+".";return;}}
        status.textContent=statusText(c);paintLeft();
      },1000);
    }

    /* Editor */
    var dlg=document.createElement("dialog");dlg.className="cfd-cue-editor";dlg.setAttribute("aria-label","Edit cues");
    dlg.innerHTML='<form method="dialog"><div class="cfd-ce-head"><b>Edit cues</b><button type="submit" value="close" class="cfd-ce-x" formnovalidate aria-label="Close">×</button></div>'+
      '<div class="cfd-ce-pick" role="radiogroup" aria-label="Cue to edit"></div>'+
      '<label class="cfd-ce-field"><span>Name</span><input type="text" class="cfd-ce-name" maxlength="14" required autocomplete="off"></label>'+
      '<fieldset class="cfd-ce-field"><legend>Icon</legend><div class="cfd-ce-icons"></div></fieldset>'+
      (T?'<label class="cfd-ce-field cfd-ce-row"><span></span><span class="cfd-ce-num"><input type="number" class="cfd-ce-target" required><span></span></span></label>':'')+
      '<fieldset class="cfd-ce-field"><legend>Outlets in this cue</legend><p class="cfd-ce-hint">Give an outlet a time and it goes back to its '+'<span class="cfd-ce-home"></span> setting when the time runs out. Once every changed outlet has run out, the cue ends.</p><ul class="cfd-ce-outlets"></ul></fieldset>'+
      '<p class="cfd-ce-note">Demo only. Your changes last until you leave this page.</p>'+
      '<div class="cfd-ce-actions"><button type="button" class="cfd-ce-btn cfd-ce-del">Delete cue</button><button type="button" class="cfd-ce-btn cfd-ce-new">New cue</button><button type="submit" value="save" class="cfd-ce-btn cfd-ce-save">Save</button></div></form>';
    root.appendChild(dlg);
    var d=function(s){return dlg.querySelector(s)};
    if(T){var ti=d(".cfd-ce-target");ti.min=T.min;ti.max=T.max;ti.step=T.step||1;ti.setAttribute("inputmode","decimal");
      d(".cfd-ce-row>span").textContent=T.label;d(".cfd-ce-num>span").textContent=T.unit;}
    var editing=null, ceIcons=d(".cfd-ce-icons"), ceOut=d(".cfd-ce-outlets"), cePick=d(".cfd-ce-pick");
    Object.keys(ICONS).forEach(function(k){var l=document.createElement("label");
      l.innerHTML='<input type="radio" name="cfd-ce-icon"><span>'+svg(k)+"</span>";
      var i=l.querySelector("input");i.value=k;i.setAttribute("aria-label",k);ceIcons.appendChild(l);});
    var opts=MINUTES.map(function(m){return '<option value="'+m+'">'+(m?m+" min":"Until "+home.name)+"</option>";}).join("");
    L.forEach(function(l){var li=document.createElement("li");
      li.innerHTML='<label class="cfd-ce-out"><span></span><input type="checkbox" role="switch"></label><select class="cfd-ce-time"></select>';
      li.querySelector("span").textContent=l;
      var sw=li.querySelector("input"),sel=li.querySelector("select");sw.dataset.l=sel.dataset.l=l;sel.innerHTML=opts;
      sel.setAttribute("aria-label",l+": how long");sw.addEventListener("change",sync);ceOut.appendChild(li);});
    function sync(){var isHome=editing===home;ceOut.classList.toggle("no-times",isHome);d(".cfd-ce-hint").hidden=isHome;
      ceOut.querySelectorAll("li").forEach(function(li){var sw=li.querySelector("input"),sel=li.querySelector("select");
        sel.disabled=isHome||sw.checked===home.out[sw.dataset.l];li.classList.toggle("is-changed",!sel.disabled);});}
    function pick(){cePick.textContent="";list.forEach(function(c){var b=document.createElement("button");
      b.type="button";b.className="cfd-ce-chip";b.textContent=c.name;b.setAttribute("role","radio");b.setAttribute("aria-checked",String(c===editing));
      b.onclick=function(){load(c)};cePick.appendChild(b);});}
    function load(c){editing=c;pick();d(".cfd-ce-name").value=c.name;d(".cfd-ce-home").textContent=home.name;
      (ceIcons.querySelector('input[value="'+c.icon+'"]')||ceIcons.querySelector("input")).checked=true;
      ceOut.querySelectorAll("input").forEach(function(i){i.checked=!!c.out[i.dataset.l];});
      ceOut.querySelectorAll("select").forEach(function(s){s.value=String(c.dur[s.dataset.l]||0);});
      if(T)d(".cfd-ce-target").value=c.target;
      d(".cfd-ce-del").hidden=builtIn.indexOf(c.id)>-1;d(".cfd-ce-new").disabled=list.length>=MAX;sync();}
    function save(){var c=editing;if(!c)return;
      c.name=d(".cfd-ce-name").value.trim()||c.name;c.icon=ceIcons.querySelector("input:checked").value;
      ceOut.querySelectorAll("input").forEach(function(i){c.out[i.dataset.l]=i.checked;});
      ceOut.querySelectorAll("select").forEach(function(s){c.dur[s.dataset.l]=s.disabled?0:parseInt(s.value,10)||0;});
      if(T){var v=parseFloat(d(".cfd-ce-target").value);if(v>=T.min&&v<=T.max)c.target=Math.round(v/(T.step||1))*(T.step||1);}
      if(list.indexOf(c)<0)list.push(c);render();if(active===c.id)apply(c.id);}
    sec.querySelector(".cfd-cue-edit").onclick=function(){load(byId(active)||home);dlg.showModal();};
    d(".cfd-ce-new").onclick=function(){made++;var c=make(C.cueNewIcon==="person"?"Person "+made:"My cue "+made,C.cueNewIcon||"moon",{},{},home.target);L.forEach(function(l){c.out[l]=home.out[l];});
      load(c);d(".cfd-ce-del").hidden=true;d(".cfd-ce-name").select();};
    d(".cfd-ce-del").onclick=function(){var i=list.indexOf(editing);if(i<0)return;list.splice(i,1);if(active===editing.id)apply(home.id);render();load(home);};
    dlg.addEventListener("close",function(){if(dlg.returnValue==="save")save();dlg.returnValue="";editing=null;});
    render();status.textContent=statusText(home);
  }
})();
