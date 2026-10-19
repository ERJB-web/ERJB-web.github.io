(() => {
 const normaliser = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase();
 document.addEventListener('click',event=>{
  const link=event.target.closest('.biblio-alphabet a');
  if(!link)return;
  event.preventDefault();
  const group=link.closest('.bibliographie-complete').querySelector(link.getAttribute('href'));
  group?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 });
 document.addEventListener('input', event => {
  if (!event.target.matches('[data-biblio-recherche]')) return;
  const root=event.target.closest('.bibliographie-complete');
  const words=normaliser(event.target.value).trim().split(/\s+/).filter(Boolean);
  let total=0;
  root.querySelectorAll('.biblio-groupe').forEach(group=>{
   let count=0;
   group.querySelectorAll('.biblio-notice').forEach(item=>{
    const match=words.every(word=>normaliser(item.textContent).includes(word));
    item.hidden=!match;if(match)count++;
   });
   group.hidden=!count;total+=count;
   const link=root.querySelector('.biblio-alphabet a[href="#'+group.id+'"]');
   if(link)link.hidden=!count;
  });
  const status=root.querySelector('[data-biblio-compte]');
  status.textContent=total.toLocaleString(document.documentElement.lang)+' '+status.dataset.unite;
  root.querySelector('[data-biblio-vide]').hidden=total!==0;
 });
})();
