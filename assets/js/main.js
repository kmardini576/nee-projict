/* بيانات الفعاليات (وهمية) — تُستخدم في كل الصفحات */
const EVENTS=[
{id:1,title:"مهرجان الكتاب",cat:"ثقافة",date:"2026-11-16",place:"المركز الثقافي",img:"ev1",desc:"معرض للكتب وورش للقراءة ولقاءات مع الكتّاب."},
{id:2,title:"ماراثون المدينة",cat:"رياضة",date:"2026-11-18",place:"الحديقة العامة",img:"ev2",desc:"سباق جري مفتوح لكل الأعمار على مسار الحديقة."},
{id:3,title:"أمسية موسيقية",cat:"موسيقى",date:"2026-11-20",place:"دار الأوبرا",img:"ev4",desc:"حفل موسيقي مع فرق محلية وعزف حي."},
{id:4,title:"يوم العائلة",cat:"عائلي",date:"2026-11-22",place:"الحديقة العامة",img:"ev3",desc:"ألعاب وعروض للأطفال وأنشطة مشتركة للعائلة."},
{id:5,title:"معرض الفن التشكيلي",cat:"ثقافة",date:"2026-11-25",place:"المركز الثقافي",img:"ev5",desc:"لوحات لفنانين من المدينة مع جولات إرشادية."},
{id:6,title:"بطولة كرة القدم المحلية",cat:"رياضة",date:"2026-12-02",place:"الملعب البلدي",img:"ev6",desc:"مباريات ودية بين أحياء المدينة."}];
const $=s=>document.querySelector(s);
const fmt=d=>new Date(d).toLocaleDateString("ar",{year:"numeric",month:"long",day:"numeric"});
const todayStr=new Date().toISOString().slice(0,10);
// بطاقة فعالية (Bootstrap Card) مع شارة "الحدث اليوم" عند تطابق التاريخ
const card=e=>`<div class="col-sm-6 col-lg-4"><div class="card event-card h-100"><img src="assets/img/${e.img}.svg" class="card-img-top" alt="${e.title}">
<div class="card-body d-flex flex-column"><div class="mb-2"><span class="badge badge-cat">${e.cat}</span> ${e.date===todayStr?'<span class="badge today-badge">الحدث اليوم</span>':''}</div>
<h3 class="h5">${e.title}</h3><p class="small text-muted mb-1">${fmt(e.date)} — ${e.place}</p><p class="small">${e.desc}</p>
<a href="event.html?id=${e.id}" class="btn btn-primary mt-auto">التفاصيل</a></div></div></div>`;
const page=document.body.dataset.page;
const params=new URLSearchParams(location.search);

if(page==="index.html"){
 // السلايدر: أول 3 فعاليات كفعاليات بارزة
 $("#featuredInner").innerHTML=EVENTS.slice(0,3).map((e,i)=>`<div class="carousel-item${i?"":" active"}"><a href="event.html?id=${e.id}"><img src="assets/img/${e.img}.svg" class="d-block w-100" alt="${e.title}"></a>
 <div class="carousel-caption"><h3>${e.title}</h3><p class="mb-0">${fmt(e.date)} — ${e.place}</p></div></div>`).join("");
 $("#latest").innerHTML=EVENTS.slice(-6).reverse().map(card).join("");
}
if(page==="events.html"){
 const fill=(sel,key)=>[...new Set(EVENTS.map(e=>e[key]))].forEach(v=>$(sel).insertAdjacentHTML("beforeend",`<option>${v}</option>`));
 fill("#fCat","cat");fill("#fPlace","place");
 if(params.get("cat"))$("#fCat").value=params.get("cat");
 // فلترة القائمة حسب النص والتاريخ والتصنيف والموقع
 const render=()=>{const q=$("#q").value.trim(),d=$("#fDate").value,c=$("#fCat").value,p=$("#fPlace").value;
  const r=EVENTS.filter(e=>(!q||e.title.includes(q)||e.desc.includes(q))&&(!d||e.date===d)&&(!c||e.cat===c)&&(!p||e.place===p));
  $("#list").innerHTML=r.map(card).join("");$("#empty").classList.toggle("d-none",r.length>0)};
 $("#filters").addEventListener("input",render);render();
}
if(page==="event.html"){
 const e=EVENTS.find(x=>x.id==params.get("id"))||EVENTS[0];
 document.title=e.title+" | دليل فعاليات المدينة";
 $("#dTitle").textContent=e.title;$("#dImg").src=`assets/img/${e.img}.svg`;$("#dImg").alt=e.title;
 $("#dMeta").textContent=`${fmt(e.date)} — ${e.place} — ${e.cat}`;
 $("#dDesc").textContent=e.desc+" انضموا إلينا واستمتعوا بيوم مميز مع أهل المدينة.";
 $("#gallery").innerHTML=EVENTS.filter(x=>x.id!==e.id).slice(0,3).map(x=>`<div class="col-4"><img src="assets/img/${x.img}.svg" class="img-fluid rounded-2" alt="صورة من المعرض"></div>`).join("");
 // أضف للتقويم: ملف ICS يُنشأ مباشرة في المتصفح
 const ymd=e.date.replaceAll("-","");
 const ics=`BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${e.title}\nDTSTART;VALUE=DATE:${ymd}\nLOCATION:${e.place}\nEND:VEVENT\nEND:VCALENDAR`;
 $("#btnCal").href=URL.createObjectURL(new Blob([ics],{type:"text/calendar"}));$("#btnCal").download=e.title+".ics";
 // شارك: نافذة المشاركة أو نسخ الرابط
 $("#btnShare").onclick=()=>{if(navigator.share)navigator.share({title:e.title,url:location.href});
  else navigator.clipboard.writeText(location.href).then(()=>$("#shareMsg").innerHTML='<div class="alert alert-success py-2">تم نسخ رابط الفعالية.</div>')};
 $("#related").innerHTML=EVENTS.filter(x=>x.cat===e.cat&&x.id!==e.id).concat(EVENTS.filter(x=>x.cat!==e.cat)).slice(0,3).map(card).join("");
}
if(page==="contact.html"){
 // تحقق بسيط من الحقول وصيغة البريد مع Bootstrap Alerts
 const show=(t,m)=>$("#formAlert").innerHTML=`<div class="alert alert-${t}">${m}</div>`;
 $("#contactForm").addEventListener("submit",ev=>{ev.preventDefault();
  const n=$("#name").value.trim(),m=$("#email").value.trim(),t=$("#msg").value.trim();
  if(!n||!m||!t)return show("danger","يرجى تعبئة جميع الحقول المطلوبة.");
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m))return show("danger","صيغة البريد الإلكتروني غير صحيحة.");
  show("success","تم إرسال رسالتك بنجاح. شكرًا لتواصلك.");ev.target.reset()});
}
