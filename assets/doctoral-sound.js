/* Original procedural score, locally synthesized. Starts after the user's Play click. */
export function createScore(){
 let ctx=null,out=null,timer=null,running=false,zone="university",beat=0,next=0;
 const scales={hub:[0,3,7,10],university:[0,4,7,11],classroom:[0,2,7,9],laboratory:[0,3,7,12],library:[0,5,7,10],office:[0,4,7,9],home:[0,2,5,9],conference:[0,4,7,11],rink:[0,3,7,10],field:[0,5,7,9],auditorium:[0,3,7,11]};
 const roots={hub:45,university:48,classroom:50,laboratory:52,library:45,office:48,home:43,conference:50,rink:52,field:45,auditorium:47};
 let enabled=true;try{enabled=localStorage.getItem("eric-music-enabled")!=="false";}catch{}
 const remember=()=>{try{localStorage.setItem("eric-music-enabled",String(enabled));}catch{}};
 const hz=m=>440*Math.pow(2,(m-69)/12);
 function note(m,time,len,gain=.03,wave="sine"){
  const o=ctx.createOscillator(),g=ctx.createGain();o.type=wave;o.frequency.value=hz(m);
  g.gain.setValueAtTime(.0001,time);g.gain.exponentialRampToValueAtTime(gain,time+.05);
  g.gain.setTargetAtTime(.0001,time+len*.56,Math.max(.04,len*.14));
  o.connect(g);g.connect(out);o.start(time);o.stop(time+len+.1);
 }
 function schedule(){
  if(!ctx||ctx.state!=="running")return;
  const bpm=zone==="rink"?134:zone==="home"?76:zone==="library"?82:zone==="conference"?108:96;
  const step=30/bpm;
  while(next<ctx.currentTime+.28){
   const root=roots[zone]||45,scale=scales[zone]||scales.hub,chord=[0,5,3,7][Math.floor(beat/8)%4];
   if(beat%8===0){note(root+chord,next,step*7,.085);note(root+chord+12,next,step*6,.027,"triangle");note(root+chord+7,next,step*6,.028);}
   if(beat%2===0)note(root+chord+24+scale[(Math.floor(beat/2)+Math.floor(beat/8))%scale.length],next,step*1.65,zone==="home"?.018:.036,"triangle");
   if(beat%4===0)note(root-12,next,step*.4,zone==="rink"?.048:.025);
   if(beat%4===2)note(root+chord+12+scale[1],next,step*.75,.016);
   beat++;next+=step;
  }
 }
 async function start(){
  if(!ctx){
   const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return false;
   ctx=new Audio();out=ctx.createGain();out.gain.value=enabled?.14:0;
   const filter=ctx.createBiquadFilter();filter.type="lowpass";filter.frequency.value=2900;
   out.connect(filter);filter.connect(ctx.destination);
  }
  try{await ctx.resume();}catch{return false;}
  if(!running){running=true;next=ctx.currentTime+.05;timer=setInterval(schedule,110);}
  return true;
 }
 function setEnabled(v){enabled=!!v;remember();if(ctx)out.gain.setTargetAtTime(enabled?.14:0,ctx.currentTime,.09);return enabled;}
 async function toggle(){if(!ctx)await start();else if(ctx.state!=="running")try{await ctx.resume();}catch{};return setEnabled(!enabled);}
 function setZone(z){if(scales[z]&&z!==zone){zone=z;beat=0;next=ctx?ctx.currentTime+.05:0;}}
 function stop(){if(timer)clearInterval(timer);running=false;ctx?.suspend?.();}
 return {start,toggle,setZone,setEnabled,stop,get enabled(){return enabled;},get started(){return running;}};
}