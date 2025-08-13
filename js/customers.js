import {getData,setData} from './storage.js';
const list=getData('customers',[]);
const table=document.querySelector('#cust-table tbody');
function render(){
  table.innerHTML='';
  list.forEach(c=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${c.name}</td><td>${c.email}</td><td>${c.phone}</td><td>${c.vehicle}</td><td>
    <button data-edit="${c.id}">Edit</button>
    <button data-del="${c.id}">Remove</button>
    <button data-book="${c.id}">Book Meeting</button>
    </td>`;
    table.appendChild(tr);
  });
}
function save(e){
  e.preventDefault();
  const id=document.getElementById('cust-id').value||Date.now();
  const entry={
    id:Number(id),
    name:document.getElementById('cust-name').value,
    email:document.getElementById('cust-email').value,
    phone:document.getElementById('cust-phone').value,
    vehicle:document.getElementById('cust-vehicle').value,
    licencePlate:document.getElementById('cust-licence').value
  };
  const idx=list.findIndex(c=>c.id===entry.id);
  if(idx>-1) list[idx]=entry; else list.push(entry);
  setData('customers',list);
  e.target.reset();
  render();
}
function edit(id){
  const c=list.find(c=>c.id==id);if(!c)return;
  document.getElementById('cust-id').value=c.id;
  document.getElementById('cust-name').value=c.name;
  document.getElementById('cust-email').value=c.email;
  document.getElementById('cust-phone').value=c.phone;
  document.getElementById('cust-vehicle').value=c.vehicle;
  document.getElementById('cust-licence').value=c.licencePlate;
}
function remove(id){
  const idx=list.findIndex(c=>c.id==id);
  if(idx>-1){list.splice(idx,1);setData('customers',list);render();}
}
render();

document.getElementById('cust-form').addEventListener('submit',save);

table.addEventListener('click',e=>{
  const id=e.target.dataset.edit||e.target.dataset.del||e.target.dataset.book;
  if(!id) return;
  if(e.target.dataset.edit) edit(Number(id));
  else if(e.target.dataset.del) remove(Number(id));
  else if(e.target.dataset.book) window.location.href=`reservations.html?customer=${id}`;
});
