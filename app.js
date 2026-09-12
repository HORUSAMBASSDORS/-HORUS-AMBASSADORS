async function load(){
  const r=await fetch("api.php?action=data",{cache:"no-store"});
  const d=await r.json();
  render("advisors",d.advisors); render("leadership",d.leadership);
}
function render(id,items){
  document.getElementById(id).innerHTML=items.map((x,i)=>`
  <article class="card">
    <div class="photo">${x.image?`<img src="${x.image}?v=${Date.now()}" alt="">`:``}</div>
    <div class="name">${esc(x.name)}</div>
    <div class="role">${esc(x.role)}</div>
  </article>`).join("");
}
function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
load();