import {getData,setData} from './storage.js';

const services = getData('services', []);
const discounts = getData('discounts', []);
const vatRate = getData('vat', 0.21);
const surcharges = getData('surcharges', {});
let editingId = null;

function el(id){return document.getElementById(id);} 
function renderServices(){
  const container = el('services-list');
  const cats = {};
  services.forEach(s=>{
    if(!cats[s.category]) cats[s.category]=[];
    cats[s.category].push(s);
  });
  container.innerHTML='';
  Object.keys(cats).forEach(cat=>{
    const h=document.createElement('h4');h.textContent=cat;container.appendChild(h);
    cats[cat].forEach(s=>{
      const label=document.createElement('label');
      label.innerHTML=`<input type="checkbox" value="${s.id}" data-price="${s.price}"> ${s.name} (${s.price})`;
      container.appendChild(label);
    });
  });
}

function renderDiscounts(){
  const container = el('discounts-list');
  container.innerHTML='';
  discounts.forEach(d=>{
    const label=document.createElement('label');
    label.innerHTML=`<input type="radio" name="discount" value="${d.percent}">${d.name}`;
    container.appendChild(label);
  });
  const custom=document.createElement('div');
  custom.innerHTML='<label>Custom % <input type="number" id="custom-discount" min="0" max="100" step="1"></label>';
  container.appendChild(custom);
}

function calcTotal(){
  const serviceCheckboxes=[...document.querySelectorAll('#services-list input[type=checkbox]')];
  let base=0;
  serviceCheckboxes.filter(cb=>cb.checked).forEach(cb=>{
    base+=Number(cb.dataset.price);
  });
  let surcharge=0;
  if(el('vehicle-type').value==='suv' && surcharges.suvEnabled){
    surcharge+=surcharges.suvRate;
  }
  const weight=parseFloat(el('weight').value||0);
  if(weight> (surcharges.weightThreshold||0)){
    surcharge+=surcharges.weightRate;
  }
  base=base*(1+surcharge);
  let discountPerc=0;
  const selectedDisc=document.querySelector('input[name=discount]:checked');
  if(selectedDisc) discountPerc=Number(selectedDisc.value);
  const custom=Number(el('custom-discount').value||0);
  if(custom) discountPerc=custom;
  base=base*(1-discountPerc/100);
  let total=base;
  if(el('vat-toggle').checked){
    total=total*(1+vatRate);
  }
  el('total').textContent=total.toFixed(2)+' '+getData('settings',{}).currency;
  return total;
}

function validate(){
  const total=calcTotal();
  const required= total>=10000;
  el('cust-req').style.display=required? 'inline':'none';
  if(required && !el('customer-name').value){
    alert('Customer name required for totals >=10000');
    return false;
  }
  return true;
}

function saveOrder(e){
  e.preventDefault();
  if(!validate()) return;
  const order={
    id: editingId||Date.now(),
    customerName: el('customer-name').value,
    vehicle: el('vehicle').value,
    licence: el('licence').value,
    vehicleType: el('vehicle-type').value,
    weight: parseFloat(el('weight').value||0),
    services: [...document.querySelectorAll('#services-list input[type=checkbox]:checked')].map(cb=>Number(cb.value)),
    discount: document.querySelector('input[name=discount]:checked')?Number(document.querySelector('input[name=discount]:checked').value): (Number(el('custom-discount').value)||0),
    vat: el('vat-toggle').checked,
    total: calcTotal()
  };
  const orders=getData('orders',[]);
  const idx=orders.findIndex(o=>o.id===order.id);
  if(idx>-1) orders[idx]=order; else orders.push(order);
  setData('orders',orders);
  window.location.href='orders.html';
}

document.getElementById('service-form').addEventListener('submit',saveOrder);
['vehicle-type','weight','vat-toggle'].forEach(id=>el(id).addEventListener('change',calcTotal));
document.addEventListener('change',e=>{
  if(e.target.matches('#services-list input, #discounts-list input')) calcTotal();
});

function loadForEdit(){
  const params=new URLSearchParams(window.location.search);
  if(params.get('order')){
    const id=Number(params.get('order'));
    const orders=getData('orders',[]);
    const order=orders.find(o=>o.id===id);
    if(order){
      editingId=id;
      el('customer-name').value=order.customerName;
      el('vehicle').value=order.vehicle;
      el('licence').value=order.licence;
      el('vehicle-type').value=order.vehicleType;
      el('weight').value=order.weight;
      order.services.forEach(sid=>{
        const cb=document.querySelector(`#services-list input[value="${sid}"]`);
        if(cb) cb.checked=true;
      });
      if(order.discount){
        const rb=document.querySelector(`#discounts-list input[value="${order.discount}"]`);
        if(rb) rb.checked=true; else el('custom-discount').value=order.discount;
      }
      el('vat-toggle').checked=order.vat;
      calcTotal();
    }
  }
  if(params.get('customer')){
    const customers=getData('customers',[]);
    const cust=customers.find(c=>c.id==params.get('customer'));
    if(cust){
      el('customer-name').value=cust.name;
      el('vehicle').value=cust.vehicle;
      el('licence').value=cust.licencePlate;
    }
  }
  if(params.get('services')){
    params.get('services').split(',').forEach(id=>{
      const cb=document.querySelector(`#services-list input[value="${id}"]`);
      if(cb) cb.checked=true;
    });
  }
}

renderServices();
renderDiscounts();
loadForEdit();
calcTotal();
