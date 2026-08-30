/* ==========================================================
   WanderLux — Appointment Request form
   Validates on submit (and live on blur), then shows a
   boarding-pass style confirmation. Also opens a pre-filled
   email as a fallback so the request reaches the agency
   without a backend server.
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('appointment-form');
  if(!form) return;

  const nameField    = document.getElementById('apt-name');
  const emailField   = document.getElementById('apt-email');
  const phoneField   = document.getElementById('apt-phone');
  const dateField    = document.getElementById('apt-date');
  const messageField = document.getElementById('apt-message');
  const statusEl     = document.getElementById('apt-status');
  const confirmation = document.getElementById('apt-confirmation');

  const AGENCY_EMAIL = 'requests@wanderluxtravel.example';

  const validators = {
    [nameField.id]:    () => WLValidate.validateMinLength(nameField, 'Name', 2),
    [emailField.id]:   () => WLValidate.validateEmail(emailField),
    [phoneField.id]:   () => WLValidate.validatePhone(phoneField, true),
    [dateField.id]:    () => WLValidate.validateFutureDate(dateField, 'Preferred date'),
  };

  Object.keys(validators).forEach(id => {
    document.getElementById(id).addEventListener('blur', validators[id]);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    confirmation.classList.remove('show');

    const results = Object.keys(validators).map(id => validators[id]());
    const allValid = results.every(Boolean);

    if(!allValid){
      WLValidate.showStatus(statusEl, 'Please correct the highlighted fields and try again.', 'error');
      const firstInvalid = form.querySelector('.has-error input, .has-error textarea');
      firstInvalid?.focus();
      return;
    }

    statusEl.className = 'form-status';
    statusEl.textContent = '';

    const details = {
      name: nameField.value.trim(),
      email: emailField.value.trim(),
      phone: phoneField.value.trim(),
      date: dateField.value,
      message: messageField.value.trim(),
    };

    showConfirmation(details);
    buildMailLink(details);
    form.reset();
  });

  function showConfirmation(details){
    document.getElementById('conf-name').textContent = details.name;
    document.getElementById('conf-date').textContent = formatDate(details.date);
    document.getElementById('conf-contact').textContent = `${details.email} \u2022 ${details.phone}`;
    confirmation.classList.add('show');
    confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function buildMailLink(details){
    const subject = encodeURIComponent(`Appointment request from ${details.name}`);
    const body = encodeURIComponent(
      `Name: ${details.name}\nEmail: ${details.email}\nPhone: ${details.phone}\nPreferred date: ${details.date}\n\nMessage:\n${details.message}`
    );
    const link = document.getElementById('apt-mailto');
    if(link){
      link.href = `mailto:${AGENCY_EMAIL}?subject=${subject}&body=${body}`;
    }
  }

  function formatDate(isoDate){
    const d = new Date(isoDate + 'T00:00:00');
    return d.toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
});
