const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menu');nav.classList.remove('is-open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');nav.classList.toggle('is-open',open);});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(nav.classList.contains('is-open')){closeMenu();menu.focus();}}});
matchMedia('(min-width: 961px)').addEventListener('change',closeMenu);
const photos=JSON.parse(document.querySelector('#gallery-data').textContent),dialog=document.querySelector('#lightbox'),img=document.querySelector('#lightbox-image'),caption=document.querySelector('#lightbox-caption');let index=0,opener;
function showPhoto(n){index=(n+photos.length)%photos.length;const p=photos[index];img.src=p.src;img.alt=p.alt;caption.textContent=p.label;document.querySelector('#photo-position').textContent=`${index+1} / ${photos.length}`;}
document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{opener=button;showPhoto(Number(button.dataset.photo));dialog.showModal();document.body.classList.add('photo-open');}));
document.querySelector('.lightbox-close').addEventListener('click',()=>dialog.close());
document.querySelector('#previous-photo').addEventListener('click',()=>showPhoto(index-1));
document.querySelector('#next-photo').addEventListener('click',()=>showPhoto(index+1));
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight')showPhoto(index+1);if(e.key==='ArrowLeft')showPhoto(index-1);});
dialog.addEventListener('close',()=>{document.body.classList.remove('photo-open');opener?.focus();});
