async function load(){
  try {
    const r = await fetch("data.json?v=" + Date.now(), {cache:"no-store"});
    if (!r.ok) throw new Error("Could not load team data");
    const d = await r.json();
    render("advisors", d.advisors || []);
    render("leadership", d.leadership || []);
  } catch (e) {
    document.getElementById("advisors").innerHTML = "<p class=\"error\">Unable to load team data.</p>";
    document.getElementById("leadership").innerHTML = "";
    console.error(e);
  }
}

function render(id,items){
  document.getElementById(id).innerHTML = items.map(x => `
    <article class="card">
      <div class="photo">
        ${x.image ? `<img src="${x.image}?v=${Date.now()}" alt="${esc(x.name)}">` : `<div class="avatar-placeholder">${initials(x.name)}</div>`}
      </div>
      <div class="name">${esc(x.name)}</div>
      <div class="role">${esc(x.role)}</div>
    </article>`).join("");
}

function initials(s){
  return String(s||"").trim().split(/\s+/).slice(0,2).map(w=>w[0]||"").join("").toUpperCase();
}
function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
load();
