/* ==========================================================
   WanderLux — Trip Cost Calculator
   Estimates a trip total from preset per-destination rates:
     total = (dailyRatePerTraveller * travellers + accommodationPerDay)
             * numberOfDays * travelStyleMultiplier
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('calculator-form');
  if(!form) return;

  const DESTINATIONS = {
    bali:        { label: 'Bali, Indonesia',        code: 'DPS', daily: 60,  stay: 90  },
    paris:       { label: 'Paris, France',          code: 'CDG', daily: 110, stay: 180 },
    tokyo:       { label: 'Tokyo, Japan',           code: 'NRT', daily: 95,  stay: 160 },
    sydney:      { label: 'Sydney, Australia',      code: 'SYD', daily: 100, stay: 170 },
    rome:        { label: 'Rome, Italy',            code: 'FCO', daily: 90,  stay: 150 },
    queenstown:  { label: 'Queenstown, New Zealand',code: 'ZQN', daily: 105, stay: 175 },
  };

  const STYLES = {
    budget:   { label: 'Budget',   multiplier: 0.8 },
    standard: { label: 'Standard', multiplier: 1.0 },
    luxury:   { label: 'Luxury',   multiplier: 1.6 },
  };

  const destinationField = document.getElementById('destination');
  const travellersField  = document.getElementById('travellers');
  const daysField        = document.getElementById('days');
  const styleField       = document.getElementById('style');

  const resultPass   = document.getElementById('calc-result');
  const resultCode   = document.getElementById('result-code');
  const resultAmount = document.getElementById('result-amount');
  const resultNote   = document.getElementById('result-note');
  const resultBreakdown = document.getElementById('result-breakdown');
  const statusEl     = document.getElementById('calc-status');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const destOk   = WLValidate.validateRequired(destinationField, 'Destination');
    const travellersOk = validateNumberField(travellersField, 'Number of travellers', 1, 20);
    const daysOk   = validateNumberField(daysField, 'Number of days', 1, 90);
    const styleOk  = WLValidate.validateRequired(styleField, 'Travel style');

    if(!(destOk && travellersOk && daysOk && styleOk)){
      WLValidate.showStatus(statusEl, 'Please fix the highlighted fields before calculating.', 'error');
      resultPass.classList.remove('show');
      return;
    }

    const dest = DESTINATIONS[destinationField.value];
    const style = STYLES[styleField.value];
    const travellers = parseInt(travellersField.value, 10);
    const days = parseInt(daysField.value, 10);

    const dailyTotal = dest.daily * travellers;
    const perDaySubtotal = dailyTotal + dest.stay;
    const beforeStyle = perDaySubtotal * days;
    const total = Math.round(beforeStyle * style.multiplier);

    statusEl.className = 'form-status';
    statusEl.textContent = '';

    resultCode.textContent = `SYD \u2192 ${dest.code}`;
    resultAmount.textContent = `$${total.toLocaleString('en-AU')}`;
    resultNote.textContent = `Estimated cost for ${travellers} traveller${travellers > 1 ? 's' : ''} to ${dest.label} for ${days} day${days > 1 ? 's' : ''}: $${total.toLocaleString('en-AU')} \u2013 ${style.label} Travel Package.`;

    resultBreakdown.innerHTML = `
      <li><span>Daily cost (\$${dest.daily} \u00d7 ${travellers} traveller${travellers > 1 ? 's' : ''})</span><span>$${dailyTotal.toLocaleString('en-AU')}/day</span></li>
      <li><span>Accommodation</span><span>$${dest.stay.toLocaleString('en-AU')}/day</span></li>
      <li><span>Duration</span><span>${days} day${days > 1 ? 's' : ''}</span></li>
      <li><span>Travel style multiplier</span><span>\u00d7${style.multiplier} (${style.label})</span></li>
    `;

    resultPass.classList.add('show');
    resultPass.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  function validateNumberField(input, label, min, max){
    const raw = input.value.trim();
    const value = Number(raw);
    if(!raw || Number.isNaN(value)){
      return WLValidate.setError(input, `${label} is required.`);
    }
    if(!Number.isInteger(value) || value < min || value > max){
      return WLValidate.setError(input, `${label} must be a whole number between ${min} and ${max}.`);
    }
    return WLValidate.setError(input, '');
  }
});
