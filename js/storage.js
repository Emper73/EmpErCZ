export function getData(key, defaultValue) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return defaultValue;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse', key, e);
    return defaultValue;
  }
}

export function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function initDefaults() {
  if (!localStorage.getItem('services')) {
    setData('services', [
      { id: 1, name: 'Interior Basic', category: 'Interior', price: 1500 },
      { id: 2, name: 'Exterior Wash', category: 'Exterior', price: 1200 },
      { id: 3, name: 'Ceramic Coating', category: 'Ceramic', price: 8000 },
      { id: 4, name: 'Engine Clean', category: 'Others', price: 2000 }
    ]);
  }
  if (!localStorage.getItem('discounts')) {
    setData('discounts', [
      { id: 1, name: '5% promo', percent: 5 },
      { id: 2, name: '10% promo', percent: 10 }
    ]);
  }
  if (!localStorage.getItem('surcharges')) {
    setData('surcharges', {
      suvEnabled: true,
      suvRate: 0.10,
      weightThreshold: 2.5,
      weightRate: 0.20
    });
  }
  if (!localStorage.getItem('vat')) {
    setData('vat', 0.21);
  }
  if (!localStorage.getItem('orders')) setData('orders', []);
  if (!localStorage.getItem('reservations')) setData('reservations', []);
  if (!localStorage.getItem('customers')) setData('customers', []);
  if (!localStorage.getItem('settings')) {
    setData('settings', { currency: 'CZK', timezone: 'Europe/Prague' });
  }
}

