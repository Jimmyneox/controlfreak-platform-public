/* One state model owns the interlocks, accelerated timers and simulated readings. */
window.createHydroEngine=function(config,paint){
  const initial=()=>({mode:'Grow',ph:5.9,ec:1.6,water:68,level:'OK',leak:'Dry',air:'OK',flow:true,locked:false,reason:'',warm:false,correcting:false,phase:'Ready',mix:0,change:0,topoff:false,ticks:0,doses:[.1,.1,.1,.1],last:['8:10 AM','10:42 AM','9:00 AM','9:05 AM'],outlets:{'Air pump':true,'Water pump':true,Chiller:true,Lights:true,Fan:true,Spare:false},notifications:{Push:true,Text:true,Email:true,Alarm:true},message:'Choose a cue or try a demo alert.',danger:false});
  let s=initial(),restore=null;
  const limit=()=>s.mode==='Away'?config.awayLimit:config.dailyLimit;
  const blocked=()=>s.locked||s.change>0||s.leak==='Wet'||s.level!=='OK'||!s.flow||!s.outlets['Water pump']||!s.outlets['Air pump'];
  const emit=()=>paint({...s,outlets:{...s.outlets},notifications:{...s.notifications},doses:[...s.doses],last:[...s.last],limit:limit(),blocked:blocked()});
  function stopDosing(){s.correcting=false;s.mix=0;s.phase='Paused';}
  function alert(message){s.message=message;s.danger=true;}
  function resumeChange(){if(!restore)return;s.outlets={...restore};if(s.leak==='Wet'||s.level!=='OK'||!s.flow){s.outlets['Water pump']=false;s.outlets['Air pump']=false;s.outlets.Chiller=false;s.air='Stopped';}restore=null;s.change=0;s.mode='Grow';s.phase=blocked()?'Paused':'Ready';s.message=blocked()?'Reservoir change complete. Safety interlock still active. Check the reservoir.':'Reservoir change complete. Previous outlets restored. Check the reservoir before leaving.';}
  function lock(reason,message){s.locked=true;s.reason=reason;stopDosing();alert(message);}
  const api={
    mode(name){
      if(s.change)resumeChange();s.mode=name;
      if(name==='Res change'){restore={...s.outlets};s.change=config.changeMinutes*60;s.outlets['Air pump']=false;s.outlets['Water pump']=false;s.outlets.Chiller=false;stopDosing();s.message='Reservoir change: pumps and dosing paused for 30 min. Demo clock runs 60 times faster.';}
      if(name==='Away'){Object.keys(s.notifications).forEach(k=>s.notifications[k]=true);s.message='Away: all alert channels on. Daily limits tightened to 0.4 fl oz per pump.';}
      if(name==='Grow'){s.message='Grow schedule selected. Existing safety locks remain until Reset.';}
      emit();
    },
    outlet(name){
      if(s.change||((s.leak==='Wet'||s.level!=='OK')&&['Air pump','Water pump','Chiller'].includes(name))||(!s.flow&&['Water pump','Chiller'].includes(name))){s.message='Safety pause active. Reset the simulated fault before restarting this outlet.';emit();return;}
      s.outlets[name]=!s.outlets[name];
      if(name==='Air pump')s.air=s.outlets[name]?'OK':'Stopped';
      if(['Air pump','Water pump'].includes(name)&&!s.outlets[name]){stopDosing();s.outlets.Chiller=false;alert(name+' switched off. Dosing paused. Optional monitoring sensor reports the stop.');}
      else if(name==='Chiller'&&s.outlets.Chiller&&!s.outlets['Water pump']){s.outlets.Chiller=false;s.message='Chiller needs water circulation. Switch the water pump on first.';}
      else{s.message=name+(s.outlets[name]?' switched on.':' switched off.');}
      emit();
    },
    notify(name){s.notifications[name]=!s.notifications[name];emit();},
    cue(name){
      if(name==='Reset'){s=initial();restore=null;s.message='Demo reset. Grow schedule restored. All faults cleared.';emit();return;}
      if(name==='Water too warm'){s.water=76;s.warm=true;s.outlets.Chiller=!blocked();alert(s.outlets.Chiller?'Water too warm: 76 °F. Chiller on. Example alert ready.':'Water too warm: cooling paused by a safety interlock. Check the reservoir.');}
      if(name==='pH drift'){
        if(blocked()){s.message='Dosing is paused by an interlock. Reset before trying pH correction.';emit();return;}
        s.ph=6.5;s.correcting=true;s.phase='Reading';s.mix=0;s.message='pH drifting above target. Checking the reading before a small pH down dose.';s.danger=false;
      }
      if(name==='Pump stopped'){s.flow=false;s.outlets['Water pump']=false;s.outlets.Chiller=false;lock('No return flow','Pump stopped. No return flow detected by the optional flow sensor. Dosing paused.');}
      if(name==='Leak'){s.leak='Wet';s.topoff=false;s.outlets['Air pump']=false;s.outlets['Water pump']=false;s.outlets.Chiller=false;s.air='Stopped';lock('Leak detected','Leak detected. Pumps, dosing and top-off off. Check the floor and tubing.');}
      if(name==='Reservoir low'){s.level='Low';s.topoff=s.leak!=='Wet';s.outlets['Air pump']=false;s.outlets['Water pump']=false;s.outlets.Chiller=false;s.air='Stopped';lock('Reservoir low','Reservoir low. Pumps and dosing paused. '+(s.topoff?'Pro top-off on.':'Top-off held off by leak interlock.'));}
      if(name==='Probe fault')lock('Probe reading suspect','Implausible probe jump. Dosing locked. Check and calibrate the probe before resuming.');
      emit();
    },
    snapshot(){return JSON.parse(JSON.stringify({...s,limit:limit(),blocked:blocked()}));},
    tick(){s.ticks++;
      if(s.change){s.change=Math.max(0,s.change-60);if(!s.change)resumeChange();}
      if(s.warm&&s.outlets.Chiller&&!blocked()){s.water=Math.max(68,s.water-.5);if(s.water===68){s.warm=false;s.message='Water back to 68 °F. Cooling example complete.';s.danger=false;}}
      if(s.correcting&&!blocked()){
        if(s.mix){s.mix--;s.phase='Mixing wait';s.message='Mixing wait: '+s.mix+' demo seconds remaining. No dose while mixing.';
          if(!s.mix){s.ph=Number((s.ph-.15).toFixed(2));s.phase='Read again';if(s.ph<=config.target[1]){s.correcting=false;s.phase='In band';s.message='pH back in band. Dosing stopped after small doses and mixing waits.';}}
        }else{const i=1;if(s.doses[i]+config.dose>limit()+.00001){lock('Daily limit reached','Daily pH down limit reached. Dosing locked. Check the reservoir.');}
          else{s.doses[i]=Number((s.doses[i]+config.dose).toFixed(2));s.last[i]='Just now';s.mix=config.mixingSeconds;s.phase='Small dose';s.message='Small pH down dose: 0.05 fl oz. Mixing wait started.';}}
      }
      emit();
    }
  };emit();return api;
};
