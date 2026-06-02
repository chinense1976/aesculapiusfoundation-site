(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  const form = document.getElementById('validation-intake');
  if (!form) return;

  const validateRequiredCheckboxGroups = () => {
    let valid = true;
    const groups = form.querySelectorAll('[data-required-group]');
    groups.forEach((group) => {
      const checkboxes = group.querySelectorAll('input[type="checkbox"]');
      const error = group.querySelector('.form-error');
      const hasChecked = Array.from(checkboxes).some((checkbox) => checkbox.checked);
      checkboxes.forEach((checkbox) => checkbox.setCustomValidity(hasChecked ? '' : 'Please select at least one option.'));
      if (error) error.hidden = hasChecked;
      if (!hasChecked) valid = false;
    });
    return valid;
  };

  form.addEventListener('change', (event) => {
    if (event.target && event.target.matches('input[type="checkbox"]')) {
      validateRequiredCheckboxGroups();
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const groupsValid = validateRequiredCheckboxGroups();
    if (!groupsValid || !form.reportValidity()) return;

    const data = new FormData(form);
    const lines = [];
    const seen = new Set();
    for (const [key] of data.entries()) {
      if (seen.has(key)) continue;
      seen.add(key);
      const values = data.getAll(key).filter(Boolean).join('; ');
      lines.push(`${key}: ${values}`);
    }

    const subject = encodeURIComponent('Diagnostic Validation Program Application');
    const body = encodeURIComponent(lines.join('\n'));
    window.location.href = `mailto:contact@aesculapiusfoundation.org?subject=${subject}&body=${body}`;

    const confirmation = document.getElementById('validation-confirmation');
    if (confirmation) confirmation.hidden = false;
  });
})();
