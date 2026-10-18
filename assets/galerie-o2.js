/* Galerie native : défilement horizontal, utilisable aussi dans les salles clonées. */
(() => {
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pending=new WeakSet();
  const index=track=>Math.max(0,Math.min(track.children.length-1,Math.round(track.scrollLeft/Math.max(1,track.clientWidth))));
  function actualiser(track){
    const gallery=track.closest('[data-galerie-o2]'); if(!gallery)return;
    const i=index(track),total=track.children.length;
    gallery.querySelector('[data-galerie-compteur]').textContent=(i+1)+' / '+total;
    gallery.querySelector('[data-galerie-precedente]').disabled=i===0;
    gallery.querySelector('[data-galerie-suivante]').disabled=i===total-1;
    gallery.dataset.planche=String(i+1);
  }
  function aller(gallery,i){
    const track=gallery.querySelector('[data-galerie-piste]');
    i=Math.max(0,Math.min(track.children.length-1,i));
    track.scrollTo({left:i*track.clientWidth,behavior:reduced()?'instant':'smooth'});
    gallery.scrollIntoView({block:'start',behavior:reduced()?'instant':'smooth'});
  }
  document.addEventListener('click',event=>{
    const link=event.target.closest('[data-galerie-planche]');
    if(link){
      const gallery=link.closest('.methode-exemples')?.querySelector('[data-galerie-o2]');
      if(gallery){event.preventDefault();aller(gallery,Number(link.dataset.galeriePlanche)-1);gallery.scrollIntoView({block:'start',behavior:reduced()?'instant':'smooth'})}
      return;
    }
    const button=event.target.closest('[data-galerie-precedente],[data-galerie-suivante]');
    if(!button)return;
    const gallery=button.closest('[data-galerie-o2]'),track=gallery.querySelector('[data-galerie-piste]');
    aller(gallery,index(track)+(button.hasAttribute('data-galerie-suivante')?1:-1));
  });
  // Capture : le défilement ne remonte pas, et chaque salle est une copie du DOM.
  document.addEventListener('scroll',event=>{
    const track=event.target;
    if(!track.matches?.('[data-galerie-piste]')||pending.has(track))return;
    pending.add(track);requestAnimationFrame(()=>{pending.delete(track);actualiser(track)});
  },true);
  document.addEventListener('keydown',event=>{
    const gallery=event.target.closest('[data-galerie-o2]');
    if(!gallery||event.ctrlKey||event.altKey||event.metaKey)return;
    const track=gallery.querySelector('[data-galerie-piste]'),i=index(track);
    const next={ArrowRight:i+1,ArrowLeft:i-1,Home:0,End:track.children.length-1}[event.key];
    if(next===undefined)return;
    event.preventDefault();aller(gallery,next);
  });
  let drag=null,suppress=null;
  document.addEventListener('dragstart',event=>{
    if(event.target.closest('[data-galerie-piste]'))event.preventDefault();
  });
  document.addEventListener('pointerdown',event=>{
    const track=event.target.closest('[data-galerie-piste]');
    if(!track||event.pointerType!=='mouse'||event.button!==0)return;
    drag={track,x:event.clientX,y:event.clientY,left:track.scrollLeft,id:event.pointerId,moved:false};
  });
  document.addEventListener('pointermove',event=>{
    if(!drag)return;
    const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
    if(!drag.moved){
      if(Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)){drag=null;return}
      if(Math.abs(dx)<8)return;
      drag.moved=true;drag.track.classList.add('is-dragging');drag.track.setPointerCapture(drag.id);
    }
    event.preventDefault();drag.track.scrollLeft=drag.left-dx;
  },{passive:false});
  function terminer(){
    if(!drag)return;
    const current=drag;drag=null;
    current.track.classList.remove('is-dragging');
    if(current.moved){suppress=current.track;aller(current.track.closest('[data-galerie-o2]'),index(current.track));}
  }
  document.addEventListener('pointerup',terminer);
  document.addEventListener('pointercancel',terminer);
  document.addEventListener('click',event=>{
    if(suppress){if(suppress.contains(event.target)){event.preventDefault();event.stopImmediatePropagation()}suppress=null}
  },true);
})();
