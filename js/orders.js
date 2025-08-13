import {getData,setData} from './storage.js';

const table=document.querySelector('#orders-table tbody');
const orders=getData('orders',[]);
const servicesMap=Object.fromEntries(getData('services',[]).map(s=>[s.id,s]));

function render(){
  table.innerHTML='';
  orders.forEach(o=>{
    const tr=document.createElement('tr');
    const serviceNames=o.services.map(id=>servicesMap[id]?.name).join(', ');
    tr.innerHTML=`<td>${o.customerName||''}</td><td>${o.vehicle||''}</td><td>${o.vehicleType}</td><td>${o.total.toFixed(2)}</td><td>
    <button data-edit="${o.id}">Edit</button>
    <button data-del="${o.id}">Remove</button>
    <button data-inv="${o.id}">Invoice</button>
    </td>`;
    table.appendChild(tr);
  });
}

function remove(id){
  const idx=orders.findIndex(o=>o.id==id);
  if(idx>-1){orders.splice(idx,1);setData('orders',orders);render();}
}

function invoice(id){
  const o=orders.find(o=>o.id==id);
  if(!o) return;
  const win=window.open('', '_blank');
  const serviceLines=o.services.map(id=>`<li>${servicesMap[id]?.name}</li>`).join('');
  win.document.write(`<h1>Invoice</h1><p>Customer: ${o.customerName}</p><ul>${serviceLines}</ul><p>Total: ${o.total.toFixed(2)}</p>`);
  win.print();
}

render();

table.addEventListener('click',e=>{
  const id=e.target.dataset.edit||e.target.dataset.del||e.target.dataset.inv;
  if(!id) return;
  if(e.target.dataset.edit){
    window.location.href=`service.html?order=${id}`;
  } else if(e.target.dataset.del){
    remove(Number(id));
  } else if(e.target.dataset.inv){
    invoice(Number(id));
  }
});
