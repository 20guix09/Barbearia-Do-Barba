import fs from 'node:fs';
const c=JSON.parse(fs.readFileSync('site.config.json','utf8'));
const esc=s=>String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const paths={calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18m-13 5h2"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',scissors:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="m8.1 8.1 12.8 12.8M14 10l7-7M8.1 15.9 12 12"/>',razor:'<path d="M7 9h10v6a5 5 0 0 1-10 0V9Z"/><rect x="5" y="3" width="14" height="6" rx="2"/><path d="M8 3v3m4-3v3m4-3v3m-6 8h4"/>',combo:'<path d="M4 3v6m3-6v6m-3-3h3M5.5 9v12m9-18h6v7h-6zm3 7v11"/>',whatsapp:'<path d="M21 11.5a9 9 0 0 1-13.4 7.8L3 21l1.5-4.6A9 9 0 1 1 21 11.5Z"/><path d="M8 7.5c-1.5 2.5 2.5 7.5 6 8 1.5.3 2.5-1.7 1.5-2.2l-1.5-.8-1 1c-1.5-.7-2.8-2-3.5-3.5l1-1-.8-1.5Z"/>',instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',plus:'<path d="M12 5v14M5 12h14"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',zoom:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12h8m-4-4v8"/>',chevron:'<path d="m9 5 7 7-7 7"/>',check:'<path d="m5 12 4 4L19 6"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M15 3.13a4 4 0 0 1 0 7.75"/><circle cx="9" cy="7" r="4"/>'};
const icon=n=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[n]}</svg>`;
const money=n=>`R$ ${n.toLocaleString('pt-BR',{minimumFractionDigits:2})}`;
const wa=`https://wa.me/${c.whatsapp}?text=${encodeURIComponent('Olá! Vim pelo site e gostaria de informações sobre um atendimento.')}`;
const club=`https://wa.me/${c.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de conhecer os planos do Club do Barba.')}`;
const external='target="_blank" rel="noopener noreferrer"';
const image=(p,classes='',sizes='(max-width: 640px) 90vw, 30vw')=>{
 const stem=p.src.replace(/\.webp$/,'');
 const srcset=[480,800].filter(w=>fs.existsSync(`dist/${stem}-${w}.webp`)).map(w=>`${stem}-${w}.webp ${w}w`).join(', ');
 return `<img class="${classes}" src="${p.src}" ${srcset?`srcset="${srcset}" sizes="${sizes}"`:''} alt="${esc(p.alt)}" width="${p.width||900}" height="${p.height||1200}" loading="lazy" decoding="async" style="object-position:${p.position||'50% 50%'}">`;
};
const schema={'@context':'https://schema.org','@type':'HairSalon',name:c.name,url:c.url,image:`${c.url}/assets/trabalho-1.webp`,logo:`${c.url}/assets/logo.webp`,telephone:`+${c.whatsapp}`,address:{'@type':'PostalAddress',streetAddress:c.address.street,addressLocality:c.address.city,addressRegion:c.address.state,postalCode:c.address.postalCode,addressCountry:'BR'},sameAs:[c.instagram,c.booking],hasMap:c.maps,openingHoursSpecification:[{'@type':'OpeningHoursSpecification',dayOfWeek:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],opens:c.hours.opens,closes:c.hours.closes}]};
const fmtTime=t=>t.replace(':','h');
const vals={...c,wa,club,external,street:c.address.street,city:c.address.city,postalCode:c.address.postalCode,hoursDays:c.hours.label,hoursRange:`${fmtTime(c.hours.opens)} às ${fmtTime(c.hours.closes)}`,schema:JSON.stringify(schema).replace(/</g,'\\u003c'),
 services:c.services.map((s,i)=>`<article class="service-card"><div class="service-card-top">${icon(['scissors','razor','combo'][i])}<span>${icon('clock')}${s.duration}</span></div><h3>${esc(s.name)}</h3><p class="service-description">${esc(s.description)}</p><dl><div><dt>José, Carlos e Alisson</dt><dd>${money(s.prices[0])}</dd></div><div><dt>Isaque</dt><dd>${money(s.prices[1])}</dd></div></dl><a class="service-book" href="${c.booking}" ${external}>${icon('calendar')} Escolher e agendar</a></article>`).join(''),
 extras:c.extras.map(s=>`<li><span>${esc(s.name)}</span><strong>${s.from?'<small>A partir de </small>':''}${money(s.price)}</strong></li>`).join(''),
 professionals:c.professionals.map(p=>`<a href="${c.booking}" ${external} class="professional"><span>${p}</span><span class="professional-action">${icon('calendar')}<span>Ver horários</span></span></a>`).join(''),
 gallery:c.gallery.map((p,i)=>`<figure class="work"><button class="gallery-item" data-photo="${i}" aria-label="Ampliar foto: ${esc(p.label)}">${image(p,'','(max-width: 640px) 80vw, (max-width: 960px) 44vw, 24vw')}<span class="photo-zoom">${icon('zoom')}</span></button><figcaption>${esc(p.label)}</figcaption></figure>`).join(''),
 galleryData:JSON.stringify(c.gallery).replace(/</g,'\\u003c')};
for(const name of Object.keys(paths))vals['icon_'+name]=icon(name);
let html=fs.readFileSync('template.html','utf8').replace(/\{\{(\w+)\}\}/g,(_,k)=>vals[k]??'');
fs.writeFileSync('dist/index.html',html);fs.copyFileSync('site.config.json','dist/site.config.json');
fs.writeFileSync('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${c.url}/sitemap.xml\n`);
fs.writeFileSync('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${c.url}/</loc><lastmod>${c.verifiedOn}</lastmod></url></urlset>`);
console.log('Site gerado: dist/index.html');
