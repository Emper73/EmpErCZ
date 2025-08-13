import {getData,setData} from './storage.js';
let services=getData('services',[]);
let discounts=getData('discounts',[]);
let surcharges=getData('surcharges',{});
let vat=getData('vat',0.21);
const svcList=document.getElementById('svc-list');
const discList=document.getElementById('disc-list');
function renderServices(){
  svcList.innerHTML='';
  services.forEach(s=>{
    const li=document.createElement('li');
    li.innerHTML=`${s.name} (${s.category}) - ${s.price} <button data-edit="${s.id}">Edit</button><button data-del="${s.id}">Del</button>`;
    svcList.appendChild(li);
  });
}
function renderDiscounts(){
  discList.innerHTML='';
  discounts.forEach(d=>{
    const li=document.createElement('li');
    li.innerHTML=`${d.name} (${d.percent}%) <button data-edit="${d.id}">Edit</button><button data-del="${d.id}">Del</button>`;
    discList.appendChild(li);
  });
}
renderServices();
renderDiscounts();

document.getElementById('svc-form').addEventListener('submit',e=>{
  e.preventDefault();
  const id=document.getElementById('svc-id').value||Date.now();
  const entry={id:Number(id),name:document.getElementById('svc-name').value,category:document.getElementById('svc-cat').value,price:Number(document.getElementById('svc-price').value)};
  const idx=services.findIndex(s=>s.id===entry.id);
  if(idx>-1) services[idx]=entry; else services.push(entry);
  setData('services',services);
  e.target.reset();
  renderServices();
});

document.getElementById('disc-form').addEventListener('submit',e=>{
  e.preventDefault();
  const id=document.getElementById('disc-id').value||Date.now();
  const entry={id:Number(id),name:document.getElementById('disc-name').value,percent:Number(document.getElementById('disc-percent').value)};
  const idx=discounts.findIndex(d=>d.id===entry.id);
  if(idx>-1) discounts[idx]=entry; else discounts.push(entry);
  setData('discounts',discounts);
  e.target.reset();
  renderDiscounts();
});

svcList.addEventListener('click',e=>{
  const id=e.target.dataset.edit||e.target.dataset.del;
  if(!id)return;
  if(e.target.dataset.edit){
    const s=services.find(s=>s.id==id);if(s){document.getElementById('svc-id').value=s.id;document.getElementById('svc-name').value=s.name;document.getElementById('svc-cat').value=s.category;document.getElementById('svc-price').value=s.price;}
  } else if(e.target.dataset.del){
    services=services.filter(s=>s.id!=id);setData('services',services);renderServices();
  }
});


discList.addEventListener('click',e=>{
  const id=e.target.dataset.edit||e.target.dataset.del;
  if(!id)return;
  if(e.target.dataset.edit){
    const d=discounts.find(d=>d.id==id);if(d){document.getElementById('disc-id').value=d.id;document.getElementById('disc-name').value=d.name;document.getElementById('disc-percent').value=d.percent;}
  } else if(e.target.dataset.del){
    discounts=discounts.filter(d=>d.id!=id);setData('discounts',discounts);renderDiscounts();
  }
});

document.getElementById('suv-enabled').checked=surcharges.suvEnabled;
document.getElementById('weight-thr').value=surcharges.weightThreshold;
document.getElementById('weight-rate').value=(surcharges.weightRate||0)*100;

document.getElementById('suv-enabled').addEventListener('change',e=>{surcharges.suvEnabled=e.target.checked;setData('surcharges',surcharges);});
document.getElementById('weight-thr').addEventListener('change',e=>{surcharges.weightThreshold=Number(e.target.value);setData('surcharges',surcharges);});
document.getElementById('weight-rate').addEventListener('change',e=>{surcharges.weightRate=Number(e.target.value)/100;setData('surcharges',surcharges);});

document.getElementById('vat-rate').value=vat*100;
document.getElementById('vat-rate').addEventListener('change',e=>{vat=Number(e.target.value)/100;setData('vat',vat);});
