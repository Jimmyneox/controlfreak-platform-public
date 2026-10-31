/* UI wiring. All state stays in this document. */
(() => {
  const config=window.CFD_CONFIG, $=s=>document.querySelector(s);
  const zones=[...document.querySelectorAll('[data-zone]')];
  const engine=window.createIrrigationEngine(config,(s,minutes)=>{
    zones.forEach((b,i)=>{const on=s.active===i;b.setAttribute('aria-checked',String(on));b.setAttribute('aria-label',(on?'Stop ':'Run ')+config.zones[i]);b.querySelector('small').textContent=on?s.remaining+' min left':'Idle · '+minutes(i)+' min';});
    $('#season').value=s.percent;$('#season-value').textContent=s.percent+'%';$('#season').setAttribute('aria-valuetext',s.percent+' percent');
    $('#duration').textContent='Manual run: '+minutes(0)+' min at '+s.percent+'% · One zone at a time';
    $('#skip').setAttribute('aria-checked',String(s.skip));
    $('#next-run').textContent=s.freeze?'Paused for freeze':s.rain?'Skipped for rain':s.skip?'Tomorrow 6:00 AM':'Thu 6:00 AM';
    $('#rain-next').textContent=s.rain?'Sensor wet':'tomorrow';
    document.querySelectorAll('[data-day]').forEach((d,i)=>d.textContent=s.freeze?'Paused':s.rain?'Rain skip':s.skip&&i===0?'Skipped':['Run','Rain skip','Freeze skip','Run','Off','Run','Off'][i]);
    $('#alert-box').classList.toggle('danger',s.danger);$('.status-label').textContent='SIMULATED · '+s.status;$('#alert-text').textContent=s.message;$('#alert-detail').textContent=s.detail;
  });
  zones.forEach((b,i)=>b.addEventListener('click',()=>engine.run(i)));
  $('#manual').addEventListener('click',()=>{const s=engine.snapshot();engine.run(s.active===null?0:s.active);});
  $('#skip').addEventListener('click',()=>engine.skip());
  $('#season').addEventListener('input',e=>engine.season(Number(e.target.value)));
  document.querySelectorAll('[data-cue]').forEach(b=>b.addEventListener('click',()=>engine.cue(b.dataset.cue)));
  const tabs=[...document.querySelectorAll('[data-tab]')];
  function selectTab(name){tabs.forEach(t=>{const on=t.dataset.tab===name;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;$('#'+t.dataset.tab+'-panel').hidden=!on;});}
  tabs.forEach((t,i)=>{t.addEventListener('click',()=>selectTab(t.dataset.tab));t.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?1:1-i;selectTab(tabs[n].dataset.tab);tabs[n].focus();}});});
  $('#back-yard').addEventListener('click',()=>{selectTab('yard');$('#yard-tab').focus();});
  document.querySelectorAll('[data-notify]').forEach(b=>b.addEventListener('click',()=>b.setAttribute('aria-checked',String(b.getAttribute('aria-checked')!=='true'))));
  $('#example').addEventListener('click',()=>{const on=[...document.querySelectorAll('[data-notify][aria-checked=true]')].map(b=>b.dataset.notify);$('#delivery').textContent=on.length?'Example delivery channels: '+on.join(', ')+'.':'All notification channels are off. No delivery selected.';$('#notification-dialog').showModal();});
})();
// When embedded on the product page, report the content height so the iframe fits it.
// Sums in-flow content only: main and the fixed caption stretch with the iframe height.
(function () {
  if (window.parent === window) return;
  var panel = document.querySelector(".cfd-device");
  var caption = document.querySelector(".caption");
  if (!panel) return;
  var last = 0;
  function send() {
    var main = panel.parentElement;
    var bottom = panel.getBoundingClientRect().bottom + parseFloat(getComputedStyle(main).paddingBottom);
    if (caption && getComputedStyle(caption).position === "static") {
      bottom = Math.max(bottom, caption.getBoundingClientRect().bottom);
    }
    var h = Math.ceil(bottom + window.scrollY);
    if (Math.abs(h - last) < 2) return;
    last = h;
    try { window.parent.postMessage({ cfDemoHeight: h }, "*"); } catch (e) {}
  }
  addEventListener("load", send);
  addEventListener("resize", send);
  if (window.ResizeObserver) new ResizeObserver(send).observe(panel);
  send();
})();
