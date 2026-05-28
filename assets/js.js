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
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

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
