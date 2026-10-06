const $=id=>document.getElementById(id),KEY="ruta-demo";
const d=new Date(), today=d.toISOString().slice(0,10);
let s=JSON.parse(localStorage.getItem(KEY)||"null")||{
date:today,departure:"17:00",base:"Local de la banda",arrival:"18:00",
type:"Pase en parado",venue:"Plaza Mayor",showTime:"19:00",
food:true,foodTime:"14:30",foodPlace:"Restaurante",dinner:false,dinnerTime:"",dinnerPlace:"",
hotel:true,hotelName:"Hotel",hotelPlace:"Hotel",second:true,secondTime:"22:00",
secondType:"Desfile",secondPlace:"Plaza Mayor",adminComments:"",comments:[]
};
const save=()=>localStorage.setItem(KEY,JSON.stringify(s));
const dateText=x=>new Date(x+"T12:00").toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long"});
const map=x=>"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(x||"");
function render(){
 $("dateTitle").textContent=dateText(s.date);
 let a=`<div class="route"><h2>Actuación 1</h2>`;
 if(s.departure)a+=item("🕐",`<b class="time">${s.departure}</b><br>Salida desde la base<div class="muted">${esc(s.base)}</div>`);
 if(s.arrival)a+=item("🚐",`<b class="time">${s.arrival}</b><br>Llegada aproximada`);
 if(s.venue)a+=item("📍",`Actuación<br><a target="_blank" href="${map(s.venue)}">${esc(s.venue)}</a><br><span class="badge">${esc(s.type)}</span>`);
 if(s.showTime)a+=item("🎵",`<b class="time">${s.showTime}</b><br>Hora de actuación`);
 if(s.food)a+=item("🍽️",`${s.foodTime||""} — Comida<br><a target="_blank" href="${map(s.foodPlace)}">${esc(s.foodPlace)}</a>`);
 if(s.dinner)a+=item("🍽️",`${s.dinnerTime||""} — Cena<br><a target="_blank" href="${map(s.dinnerPlace)}">${esc(s.dinnerPlace)}</a>`);
 if(s.hotel)a+=item("🏨",`${esc(s.hotelName)}<br><a target="_blank" href="${map(s.hotelPlace)}">${esc(s.hotelPlace)}</a>`);
 if(s.second)a+=`<div class="second"><b>Actuación 2</b>${item("🕐",`<b class="time">${s.secondTime}</b><br><span class="badge">${esc(s.secondType)}</span><br><a target="_blank" href="${map(s.secondPlace)}">📍 ${esc(s.secondPlace)}</a>`)}</div>`;
 a+="</div>"; $("route").innerHTML=a;
 let c=s.comments||[];$("count").textContent=c.length?`(${c.length})`:"";
 $("comments").innerHTML=c.map(x=>`<div class="comment"><b>${esc(x.author)}</b> <small>${esc(x.time)}</small><div>${esc(x.text)}</div></div>`).join("")||'<div class="empty">No hay comentarios todavía.</div>';
}
function item(icon,text){return `<div class="item"><div>${icon}</div><div>${text}</div></div>`}
function esc(x){return String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function toggles(){[["food","foodBox"],["dinner","dinnerBox"],["hotel","hotelBox"],["second","secondBox"]].forEach(([a,b])=>$(b).style.display=$(a).checked?"block":"none")}
function fill(){
 const ids=["date","departure","base","arrival","type","venue","showTime","foodTime","foodPlace","dinnerTime","dinnerPlace","hotelName","hotelPlace","secondTime","secondType","secondPlace","adminComments"];
 ids.forEach(id=>$(id).value=s[id]??"");
 ["food","dinner","hotel","second"].forEach(id=>$(id).checked=!!s[id]);toggles();
}
$("adminBtn").onclick=()=>{$("adminDialog").showModal();fill()};
$("closeAdmin").onclick=()=>$("adminDialog").close();
["food","dinner","hotel","second"].forEach(x=>$(x).onchange=toggles);
$("adminForm").onsubmit=e=>{e.preventDefault();
["date","departure","base","arrival","type","venue","showTime","foodTime","foodPlace","dinnerTime","dinnerPlace","hotelName","hotelPlace","secondTime","secondType","secondPlace","adminComments"].forEach(id=>s[id]=$(id).value);
["food","dinner","hotel","second"].forEach(id=>s[id]=$(id).checked);save();render();$("adminDialog").close()};
$("commentForm").onsubmit=e=>{e.preventDefault();s.comments.push({author:$("author").value,text:$("comment").value,time:new Date().toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})});save();$("author").value="";$("comment").value="";render()};
$("calendarBtn").onclick=()=>{$("month").value=s.date.slice(0,7);$("calendarList").innerHTML=`<div class="empty">Fecha configurada: ${dateText(s.date)}.<br><br>Esta demo usa una sola hoja de ruta. La siguiente versión tendrá múltiples fechas y actuaciones guardadas.</div>`;$("calendarDialog").showModal()};
$("closeCalendar").onclick=()=>$("calendarDialog").close();render();
