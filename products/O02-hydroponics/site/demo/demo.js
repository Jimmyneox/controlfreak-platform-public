/* All interactions stay in this document. Nothing is transmitted or persisted. */
(()=>{
  const $=s=>document.querySelector(s),config=window.CFD_CONFIG;
  let latest;
  const engine=window.createHydroEngine(config,s=>{
    latest=s;
    const jitter=matchMedia('(prefers-reduced-motion: reduce)').matches?0:Math.sin(s.ticks*.9);
    $('#ph').textContent=(s.ph+(s.correcting?0:jitter*.015)).toFixed(2).replace(/0$/,'');
    $('#ec').textContent=(s.ec+jitter*.008).toFixed(2).replace(/0$/,'');
    $('#water').textContent=(s.water+(s.warm?0:jitter*.1)).toFixed(s.warm?1:0)+' °F';
    $('#water-detail').textContent='Chiller '+(s.outlets.Chiller?'On':'Off');
    $('#level').textContent=s.level;$('#level-detail').textContent=s.topoff?'Pro top-off On':s.level==='Low'?'Low float triggered':'Low float OK';
    $('#air').textContent=s.air;$('#air-detail').textContent='Optional pressure sensor fitted';$('#leak').textContent=s.leak;$('#leak-detail').textContent=s.leak==='Wet'?'Pumps held off':'Sensor ready';
    $('[data-mode="Grow"]').setAttribute('aria-pressed',String(s.mode==='Grow'));
    $('[data-mode="Away"]').setAttribute('aria-pressed',String(s.mode==='Away'));
    $('[data-mode="Res change"]').setAttribute('aria-pressed',String(s.mode==='Res change'));
    $('#mode-detail').textContent=s.change?'Reservoir change · '+Math.ceil(s.change/60)+' min left · Clock 60× faster':s.mode==='Away'?'Away · All channels enabled · Tighter daily limits':'Pro setup · Optional pump monitoring sensors fitted';
    $('#dose-state').textContent=s.blocked?'Paused':s.phase;
    $('#safety').textContent=s.locked?'Dosing lockout · '+s.reason:s.change?'Reservoir change · Pumps and dosing paused':s.blocked?'Dosing paused · Check circulation':s.mix?'Mixing wait active · Daily limits on · Probe lockout ready':'Mixing waits · Daily limits on · Probe lockout ready';
    document.querySelectorAll('[data-dose-bar]').forEach((b,i)=>{b.max=s.limit;b.value=s.doses[i];b.setAttribute('aria-valuetext',s.doses[i].toFixed(2)+' of '+s.limit.toFixed(1)+' fluid ounces');$('[data-dose-time="'+i+'"]').textContent=s.last[i]==='Just now'?'Just now':'Last '+s.last[i];$('[data-dose-amount="'+i+'"]').textContent=s.doses[i].toFixed(2)+' / '+s.limit.toFixed(1)+' fl oz';});
    document.querySelectorAll('[data-outlet]').forEach(b=>{const on=s.outlets[b.dataset.outlet];b.setAttribute('aria-checked',String(on));b.querySelector('small').textContent=on?'On':'Off';});
    document.querySelectorAll('[data-notify]').forEach(b=>b.setAttribute('aria-checked',String(s.notifications[b.dataset.notify])));
    // Announce state transitions without repeating sensor jitter to screen readers.
    if($('#alert-box').textContent!==s.message)$('#alert-box').textContent=s.message;
    $('#alert-box').classList.toggle('danger',s.danger);
  });
  document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>engine.mode(b.dataset.mode)));
  document.querySelectorAll('[data-outlet]').forEach(b=>b.addEventListener('click',()=>engine.outlet(b.dataset.outlet)));
  document.querySelectorAll('[data-notify]').forEach(b=>b.addEventListener('click',()=>engine.notify(b.dataset.notify)));
  document.querySelectorAll('[data-alert]').forEach(b=>b.addEventListener('click',()=>engine.cue(b.dataset.alert)));
  // A distinct probe fault demonstrates the lockout rather than a normal correctable drift.
  const probeButton=document.createElement('button');probeButton.className='probe-test';probeButton.textContent='Try an implausible probe reading';probeButton.addEventListener('click',()=>engine.cue('Probe fault'));$('.safety-row').after(probeButton);
  $('#example').addEventListener('click',()=>{
    $('#dialog-message').textContent=latest.danger?latest.message:'Water too warm: 76 °F. Chiller switched on. Check your reservoir.';
    const on=config.channels.filter(n=>latest.notifications[n]);$('#delivery').textContent=on.length?'Example delivery channels: '+on.join(', ')+'.':'All notification channels are off. No delivery selected.';
    $('#notification-dialog').showModal();
  });
  setInterval(()=>{if(!document.hidden)engine.tick();},1000);
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
