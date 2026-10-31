/* Single active zone, accelerated clock, and simulated sensor events. */
window.createIrrigationEngine = function(config, paint) {
  const initial = () => ({active:null,remaining:0,percent:config.initialPercent,skip:false,rain:false,freeze:false,locked:false,message:'Choose a zone or try a demo alert.',detail:'No connected equipment. Timers run 60 times faster.',status:'Ready',danger:false});
  let state=initial();
  const minutes=i=>Math.max(1,Math.round(config.baseMinutes[i]*state.percent/100));
  const emit=()=>paint({...state},minutes);
  function stop(){state.active=null;state.remaining=0;}
  const api={
    run(i){if(state.locked||state.rain||state.freeze||state.skip){state.message='Run paused. Reset the demo to clear the skip or alert.';emit();return;}if(state.active===i){stop();state.message='Zone stopped. Master valve closed.';}else{stop();state.active=i;state.remaining=minutes(i);state.message=config.zones[i]+' running. Master valve open.';}state.status='Manual run';state.detail='SIMULATED · One zone at a time. Each second represents one minute.';emit();},
    season(percent){const old=state.percent;state.percent=percent;if(state.active!==null)state.remaining=Math.max(1,Math.round(state.remaining*percent/old));emit();},
    skip(){state.skip=!state.skip;stop();state.status='Schedule';state.message=state.skip?'Today skipped. All zones off. Master valve closed.':'Today restored. Your schedule is ready.';state.detail='SIMULATED · No schedule or equipment has been changed.';emit();},
    cue(name){stop();state.status=name;state.danger=false;
      if(name==='Reset'){state=initial();state.message='Demo reset. All zones off. Master valve closed.';}
      if(name==='Stuck valve'){state.locked=true;state.danger=true;state.message='Zone 3 still flowing after it closed. Master valve shut. Alert sent.';state.detail='SIMULATED · Requires Pro flow sensor and installed master valve. No real message sent.';}
      if(name==='Broken line'){state.locked=true;state.danger=true;state.message='Flow far above normal on Front lawn. Zone and master valve shut. Alert sent.';state.detail='SIMULATED · Example Pro flow monitoring. No real message sent.';}
      if(name==='Rain'){state.rain=true;state.message='Rain sensor wet. Next runs skipped. Master valve closed.';state.detail='SIMULATED · Sensor skip, not weather forecast scheduling.';}
      if(name==='Freeze'){state.freeze=true;state.message='Outdoor air 33 °F. Near freezing. Watering paused. Master valve closed.';state.detail='SIMULATED · Outdoor air probe example. Reset to resume.';}
      emit();},
    snapshot(){return {...state};}
  };
  setInterval(()=>{if(state.active===null)return;state.remaining--;if(state.remaining<=0){stop();state.status='Complete';state.message='Run complete. Zone and master valve closed.';state.detail='SIMULATED · All zones idle.';}emit();},config.secondsPerMinute*1000);
  emit();return api;
};
