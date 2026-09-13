(() => {
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbxMkAafaG1IRUvC7HF-cfBgEWuwFEHf6WNnzcr3WbRikTONN85N7MSCVkDr5ct5MJQn/exec';
  const CALENDLY_URL = 'https://calendly.com/j-saturday-ai';
  const modal = document.querySelector('[data-consultation-modal]');
  const dialog = modal?.querySelector('[role="dialog"]');
  const form = modal?.querySelector('[data-consultation-form]');
  const frame = document.querySelector('[data-consultation-frame]');
  const status = modal?.querySelector('[data-consultation-status]');
  const submitButton = modal?.querySelector('[data-consultation-submit]');
  const triggers = [...document.querySelectorAll('[data-consultation-trigger]')];
  const closeControls = modal ? [...modal.querySelectorAll('[data-consultation-close]')] : [];

  if (!modal || !dialog || !form || !frame || !status || !submitButton || !triggers.length) return;

  let lastFocused = null;
  let submissionTimer = null;
  let submitting = false;

  const fields = {
    name: form.elements.namedItem('name'),
    email: form.elements.namedItem('email'),
    company: form.elements.namedItem('company'),
    website: form.elements.namedItem('website'),
    aiInterest: form.elements.namedItem('aiInterest'),
    message: form.elements.namedItem('message')
  };

  function focusableElements() {
    return [...dialog.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter((element) => !element.hasAttribute('hidden'));
  }

  function openModal(event) {
    event?.preventDefault();
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modal.hidden = false;
    document.body.classList.add('consultation-modal-open');
    status.textContent = '';
    status.removeAttribute('data-state');
    requestAnimationFrame(() => fields.name?.focus());
  }

  function closeModal() {
    if (submitting) return;
    modal.hidden = true;
    document.body.classList.remove('consultation-modal-open');
    lastFocused?.focus();
  }

  function setFieldError(field, message) {
    if (!(field instanceof HTMLElement)) return;
    const error = form.querySelector(`[data-error-for="${field.getAttribute('name')}"]`);
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (error) error.textContent = message || '';
  }

  function validateForm() {
    let valid = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    Object.values(fields).forEach((field) => field && setFieldError(field, ''));

    if (!fields.name?.value.trim()) {
      setFieldError(fields.name, 'Please enter your name.');
      valid = false;
    }

    if (!fields.email?.value.trim()) {
      setFieldError(fields.email, 'Please enter your email address.');
      valid = false;
    } else if (!emailPattern.test(fields.email.value.trim())) {
      setFieldError(fields.email, 'Please enter a valid email address.');
      valid = false;
    }

    if (!fields.aiInterest?.value) {
      setFieldError(fields.aiInterest, 'Please choose an AI area to explore.');
      valid = false;
    }

    if (!fields.message?.value.trim()) {
      setFieldError(fields.message, 'Please tell me briefly about the opportunity or challenge.');
      valid = false;
    }

    if (fields.website?.value.trim()) {
      try {
        const raw = fields.website.value.trim();
        const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid protocol');
      } catch {
        setFieldError(fields.website, 'Please enter a valid website URL or leave this blank.');
        valid = false;
      }
    }

    if (!valid) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      status.textContent = 'Please review the highlighted fields.';
      status.dataset.state = 'error';
    }

    return valid;
  }

  function setSubmitting(active) {
    submitting = active;
    submitButton.disabled = active;
    submitButton.textContent = active ? 'Sending your details…' : 'Continue to Scheduling';
  }

  function calendlyDestination() {
    const url = new URL(CALENDLY_URL);
    const name = fields.name?.value.trim();
    const email = fields.email?.value.trim();
    if (name) url.searchParams.set('name', name);
    if (email) url.searchParams.set('email', email);
    return url.toString();
  }

  triggers.forEach((trigger) => trigger.addEventListener('click', openModal));
  closeControls.forEach((control) => control.addEventListener('click', closeModal));

  document.addEventListener('keydown', (event) => {
    if (modal.hidden) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = focusableElements();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  form.addEventListener('input', (event) => {
    if (event.target instanceof HTMLElement && event.target.hasAttribute('name')) {
      setFieldError(event.target, '');
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (submitting || !validateForm()) return;

    status.textContent = 'Sending your details…';
    status.removeAttribute('data-state');
    setSubmitting(true);

    form.action = ENDPOINT;
    form.target = frame.name;

    clearTimeout(submissionTimer);
    submissionTimer = window.setTimeout(() => {
      if (!submitting) return;
      setSubmitting(false);
      status.textContent = 'We could not confirm your request. Please try again.';
      status.dataset.state = 'error';
    }, 15000);

    form.submit();
  });

  window.addEventListener('message', (event) => {
    if (event.source !== frame.contentWindow) return;
    const data = event.data;
    if (!data || data.type !== 'consultation-form-result' || !data.payload) return;

    clearTimeout(submissionTimer);

    if (data.payload.ok) {
      status.textContent = 'Request received. Opening available consultation times…';
      status.dataset.state = 'success';
      setSubmitting(false);
      window.setTimeout(() => {
        window.location.assign(calendlyDestination());
      }, 700);
      return;
    }

    setSubmitting(false);
    status.textContent = data.payload.message || 'We could not save your consultation request. Please try again.';
    status.dataset.state = 'error';
  });
})();
