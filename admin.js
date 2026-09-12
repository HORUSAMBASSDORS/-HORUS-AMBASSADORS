let data={};
async function init(){data=await (await fetch("api.php?action=data",{cache:"no-store"})).json();render();}
function all(){return [...data.advisors.map((x,i)=>({g:"advisors",i,x})),...data.leadership.map((x,i)=>({g:"leadership",i,x}))]}
function render(){
 const root=document.getElementById("people"); root.innerHTML="";
 all().forEach(({g,i,x})=>{
  const el=document.createElement("div");el.className="person";
  el.innerHTML=`<div><div class="thumb" id="t_${g}_${i}">${x.image?`<img id="im_${g}_${i}" src="${x.image}?v=${Date.now()}">`:''}</div>
  <input class="upload" type="file" accept="image/*" onchange="upload(this,'${g}',${i})"></div>
  <div class="controls"><b>${x.role}</b>
  <label>Name</label><input type="text" value="${esc(x.name)}" oninput="data.${g}[${i}].name=this.value">
  <label>Zoom</label><input type="range" min="50" max="250" value="${x.zoom||100}" oninput="setZoom('${g}',${i},this.value)">
  <label>Move X</label><input type="range" min="-300" max="300" value="${x.x||0}" oninput="setPos('${g}',${i},'x',this.value)">
  <label>Move Y</label><input type="range" min="-300" max="300" value="${x.y||0}" oninput="setPos('${g}',${i},'y',this.value)"></div>`;
  root.appendChild(el);apply(g,i);
 });
}
function esc(s){return String(s||"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;")}
function setZoom(g,i,v){data[g][i].zoom=+v;apply(g,i)}
function setPos(g,i,k,v){data[g][i][k]=+v;apply(g,i)}
function apply(g,i){const x=data[g][i],im=document.getElementById(`im_${g}_${i}`);if(!im)return;im.style.width=(x.zoom||100)+"%";im.style.left=(x.x||0)+"px";im.style.top=(x.y||0)+"px"}
async function upload(input,g,i){
 if(!input.files[0])return; let fd=new FormData();fd.append("image",input.files[0]);
 let r=await fetch("api.php?action=upload",{method:"POST",body:fd});let j=await r.json();
 if(j.image){data[g][i].image=j.image;data[g][i].zoom=100;data[g][i].x=0;data[g][i].y=0;render();}
}
async function saveAll(){
 document.getElementById("msg").textContent=" Saving...";
 let r=await fetch("api.php?action=save",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
 document.getElementById("msg").textContent=r.ok?" Saved ✓":" Save failed";
}
init();