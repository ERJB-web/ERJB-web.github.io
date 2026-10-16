/* Original real-time synthetic ice hockey SFX, triggered after explicit Play gesture. */
export function createHockeySfx(){
 let ctx=null,out=null,noiseBuffer=null,enabled=true,lastSkate=0,lastContact=0;
 function unlock(){
  if(ctx){if(ctx.state==="suspended")ctx.resume().catch(()=>{});return;}
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  ctx=new AC();out=ctx.createGain();out.gain.value=.40;out.connect(ctx.destination);
  noiseBuffer=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);
  const data=noiseBuffer.getChannelData(0),rand=(()=>{let x=10817;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296;}})();
  for(let i=0;i<data.length;i++)data[i]=rand()*2-1;
 }
 function hiss(time,duration,volume,low=550,high=4000){
  if(!ctx)return;
  const src=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();
  src.buffer=noiseBuffer;src.loop=true;f.type="bandpass";f.frequency.value=low;f.Q.value=Math.max(.1,low/(high-low));
  src.connect(f);f.connect(g);g.connect(out);
  g.gain.setValueAtTime(.0001,time);g.gain.exponentialRampToValueAtTime(Math.max(.0005,volume),time+.012);
  g.gain.exponentialRampToValueAtTime(.0001,time+duration);
  src.start(time);src.stop(time+duration+.03);
 }
 function tone(freq,seconds,volume,type="sine",endFreq=0){
  if(!ctx)return;
  const t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();o.type=type;
  o.frequency.setValueAtTime(freq,t);if(endFreq)o.frequency.exponentialRampToValueAtTime(Math.max(10,endFreq),t+seconds);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.001,volume),t+.016);g.gain.exponentialRampToValueAtTime(.0001,t+seconds);
  o.connect(g);g.connect(out);o.start(t);o.stop(t+seconds+.02);
 }
 function play(type,power=1){
  if(!ctx||!enabled)return;
  const t=ctx.currentTime;
  switch(type){
   case"skate": if(t-lastSkate>.075){lastSkate=t;hiss(t,.11,.025*power,1100,6200);}break;
   case"edge": if(t-lastSkate>.12){lastSkate=t;hiss(t,.21,.08*power,1800,7500);}break;
   case"shot":tone(130,.09,.22*power,"triangle",65);hiss(t,.085,.18*power,650,5500);break;
   case"board":if(t-lastContact>.14){lastContact=t;tone(95,.16,.18,"square",52);hiss(t,.12,.13,500,2200);}break;
   case"save":tone(290,.11,.16,"triangle",140);hiss(t,.15,.22,1100,5500);break;
   case"fall":hiss(t,.43,.16,350,1900);tone(85,.30,.22,"sawtooth",36);break;
   case"goal":
    // Arena horn and crowd swell with independent voices.
    tone(196,.76,.17,"sawtooth",196);tone(293.66,.82,.13,"sawtooth",293.66);
    tone(392,.65,.08,"triangle",392);hiss(t,1.15,.12,900,4200);break;
   case"faceoff":tone(640,.12,.065,"triangle",470);break;
  }
 }
 function setEnabled(on){enabled=!!on;if(out&&ctx)out.gain.setTargetAtTime(enabled?.40:0,ctx.currentTime,.04);}
 return {unlock,play,setEnabled,get ready(){return!!ctx}};
}
