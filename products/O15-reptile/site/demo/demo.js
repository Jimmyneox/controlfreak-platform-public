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
    notify:{label:"Simulated alert",channels:["Push","Text","Email","Alarm"]}
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
    var n=q(".cfd-notify"), t=q(".cfd-toast");
    if(n&&C.notify){
      n.querySelector("span").textContent="Notification types (simulated): "+C.notify.channels.join(" · ");
      n.querySelector("button").onclick=function(){
        t.textContent="SIMULATED · "+C.notify.label+" — example only";
        t.classList.add("show");setTimeout(function(){t.classList.remove("show")},3500);};
    }
  });
})();
