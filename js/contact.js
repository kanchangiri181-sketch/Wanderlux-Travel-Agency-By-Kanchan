/* ==========================================================
   WanderLux — Contact form
   Validates fields, then opens the visitor's email client
   pre-filled with their message so it sends directly from
   the website without a custom backend.
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if(!form) return;

  const nameField    = document.getElementById('c-name');
  const emailField   = document.getElementById('c-email');
  const subjectField = document.getElementById('c-subject');
  const messageField = document.getElementById('c-message');
  const statusEl     = document.getElementById('contact-status');

  const AGENCY_EMAIL = 'hello@wanderluxtravel.example';

  const validators = {
    [nameField.id]:    () => WLValidate.validateMinLength(nameField, 'Name', 2),
    [emailField.id]:   () => WLValidate.validateEmail(emailField),
    [messageField.id]: () => WLValidate.validateMinLength(messageField, 'Message', 10),
  };

  Object.keys(validators).forEach(id => {
    document.getElementById(id).addEventListener('blur', validators[id]);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const allValid = Object.keys(validators).map(id => validators[id]()).every(Boolean);

    if(!allValid){
      WLValidate.showStatus(statusEl, 'Please correct the highlighted fields before sending.', 'error');
      const firstInvalid = form.querySelector('.has-error input, .has-error textarea');
      firstInvalid?.focus();
      return;
    }

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const subject = subjectField.value.trim() || 'Website enquiry';
    const message = messageField.value.trim();

    const mailSubject = encodeURIComponent(`${subject} \u2014 from ${name}`);
    const mailBody = encodeURIComponent(`${message}\n\n\u2014\n${name}\n${email}`);
    const mailtoLink = `mailto:${AGENCY_EMAIL}?subject=${mailSubject}&body=${mailBody}`;

    WLValidate.showStatus(statusEl, 'Your email client is opening with your message ready to send. If nothing opens, email us directly at hello@wanderluxtravel.example.', 'success');

    window.location.href = mailtoLink;
    form.reset();
  });
});
