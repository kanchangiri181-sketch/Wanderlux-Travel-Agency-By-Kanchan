/* ==========================================================
   WanderLux — shared form validation helpers
   Plain JS, no dependencies. Works with markup where each
   field is wrapped in .field and has a sibling .error-msg
   element (id = `${input.id}-error`) referenced via
   aria-describedby on the input.
   ========================================================== */

const WLValidate = (() => {

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^[0-9()+\-\s]{7,20}$/;

  function setError(input, message){
    const field = input.closest('.field');
    const errorEl = document.getElementById(`${input.id}-error`);
    if(field) field.classList.toggle('has-error', Boolean(message));
    if(errorEl) errorEl.textContent = message || '';
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    return !message;
  }

  function validateRequired(input, label){
    if(!input.value.trim()){
      return setError(input, `${label} is required.`);
    }
    return setError(input, '');
  }

  function validateEmail(input){
    const value = input.value.trim();
    if(!value){ return setError(input, 'Email is required.'); }
    if(!EMAIL_RE.test(value)){ return setError(input, 'Enter a valid email address, e.g. name@example.com.'); }
    return setError(input, '');
  }

  function validatePhone(input, required = false){
    const value = input.value.trim();
    if(!value){
      return required ? setError(input, 'Phone number is required.') : setError(input, '');
    }
    if(!PHONE_RE.test(value)){
      return setError(input, 'Enter a valid phone number (digits, spaces, + or - only).');
    }
    return setError(input, '');
  }

  function validateFutureDate(input, label){
    const value = input.value;
    if(!value){ return setError(input, `${label} is required.`); }
    const chosen = new Date(value + 'T00:00:00');
    const today = new Date();
    today.setHours(0,0,0,0);
    if(chosen < today){
      return setError(input, `${label} cannot be in the past.`);
    }
    return setError(input, '');
  }

  function validateMinLength(input, label, min){
    const value = input.value.trim();
    if(value.length < min){
      return setError(input, `${label} should be at least ${min} characters.`);
    }
    return setError(input, '');
  }

  function showStatus(el, message, type){
    el.textContent = message;
    el.className = `form-status ${type}`;
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  }

  return {
    setError,
    validateRequired,
    validateEmail,
    validatePhone,
    validateFutureDate,
    validateMinLength,
    showStatus,
  };
})();
