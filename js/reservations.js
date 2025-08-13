import {getData,setData} from './storage.js';
const services=getData('services',[]);
const resList=getData('reservations',[]);
const servicesDiv=document.getElementById('res-services');
const table=document.querySelector('#res-table tbody');
function renderServices(){
  servicesDiv.innerHTML='';
  services.forEach(s=>{
    const label=document.createElement('label');
    label.innerHTML=`<input type="checkbox" value="${s.id}"> ${s.name}`;
    servicesDiv.appendChild(label);
  });
}
function render(){
  table.innerHTML='';
  resList.sort((a,b)=>new Date(a.datetime)-new Date(b.datetime));
  resList.forEach(r=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${r.name}</td><td>${r.vehicle}</td><td>${new Date(r.datetime).toLocaleString()}</td><td>
    <button data-edit="${r.id}">Edit</button>
    <button data-del="${r.id}">Remove</button>
    <button data-order="${r.id}">Convert to Order</button>
    </td>`;
    table.appendChild(tr);
  });
  updateCountdown();
}
function save(e){
  e.preventDefault();
  const id=document.getElementById('res-id').value||Date.now();
  const entry={
    customerId: document.getElementById("res-customer").value,
    id:Number(id),
    name:document.getElementById('res-name').value,
    phone:document.getElementById('res-phone').value,
    vehicle:document.getElementById('res-vehicle').value,
    licence:document.getElementById('res-licence').value,
    type:document.getElementById('res-type').value,
    services:[...servicesDiv.querySelectorAll('input:checked')].map(cb=>Number(cb.value)),
    datetime:document.getElementById('res-dt').value
  };
  const idx=resList.findIndex(r=>r.id===entry.id);
  if(idx>-1) resList[idx]=entry; else resList.push(entry);
  setData('reservations',resList);
  e.target.reset();
  render();
}
function edit(id){
  const r=resList.find(r=>r.id==id);if(!r)return;
  document.getElementById('res-id').value=r.id;
  document.getElementById('res-name').value=r.name;
  document.getElementById('res-phone').value=r.phone;
  document.getElementById('res-vehicle').value=r.vehicle;
  document.getElementById('res-licence').value=r.licence;
  document.getElementById('res-type').value=r.type;
  document.getElementById('res-dt').value=r.datetime;
  servicesDiv.querySelectorAll('input').forEach(cb=>cb.checked=r.services.includes(Number(cb.value)));
}
function remove(id){
  const idx=resList.findIndex(r=>r.id==id);
  if(idx>-1){resList.splice(idx,1);setData('reservations',resList);render();}
}
function updateCountdown(){
  if(resList.length===0){document.getElementById('next-countdown').textContent='';return;}
  const next=resList[0];
  const diff=new Date(next.datetime)-new Date();
  if(diff>0){
    const hours=Math.floor(diff/3600000);
    const minutes=Math.floor(diff%3600000/60000);
    document.getElementById('next-countdown').textContent=`${hours}h ${minutes}m until next appointment`;
  } else {
    document.getElementById('next-countdown').textContent='Now';
  }
}
setInterval(updateCountdown,60000);

renderServices();
render();

document.getElementById('res-form').addEventListener('submit',save);

table.addEventListener('click',e=>{
  const id=e.target.dataset.edit||e.target.dataset.del||e.target.dataset.order;
  if(!id) return;
  if(e.target.dataset.edit) edit(Number(id));
  else if(e.target.dataset.del) remove(Number(id));
  else if(e.target.dataset.order) {
    const r=resList.find(r=>r.id==id);
    const svc=r.services.join(',');
    let url='service.html?services='+svc;
    if(r.customerId) url += `&customer=${r.customerId}`;
    window.location.href=url;
  }
});

// Prefill from customer link
const params=new URLSearchParams(window.location.search);
if(params.get('customer')){
  const cust=getData('customers',[]).find(c=>c.id==params.get('customer'));
  if(cust){
    document.getElementById('res-name').value=cust.name;
    document.getElementById('res-customer').value=cust.id;
    document.getElementById('res-phone').value=cust.phone;
    document.getElementById('res-vehicle').value=cust.vehicle;
    document.getElementById('res-licence').value=cust.licencePlate;
  }
}
