import {getData,setData} from './storage.js';
const settings=getData('settings',{});
const currencyInput=document.getElementById('set-currency');
const tzInput=document.getElementById('set-timezone');
currencyInput.value=settings.currency||'CZK';
tzInput.value=settings.timezone||'Europe/Prague';
document.getElementById('settings-form').addEventListener('submit',e=>{
  e.preventDefault();
  settings.currency=currencyInput.value;
  settings.timezone=tzInput.value;
  setData('settings',settings);
  alert('Saved');
});
