(() => {
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbxMkAafaG1IRUvC7HF-cfBgEWuwFEHf6WNnzcr3WbRikTONN85N7MSCVkDr5ct5MJQn/exec';
  const CALENDLY_URL = 'https://calendly.com/j-saturday-ai';

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = 'consultation-form.css';
  document.head.appendChild(stylesheet);

  const modalMarkup = `
    <div class="consultation-modal" data-consultation-modal hidden>
      <div class="consultation-modal__backdrop" data-consultation-close></div>
      <div class="consultation-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="consultation-title" aria-describedby="consultation-description">
        <button class="consultation-modal__close" type="button" aria-label="Close consultation form" data-consultation-close>×</button>
        <p class="consultation-modal__eyebrow">AI Consultation</p>
        <h2 id="consultation-title">Tell me what you’d like to explore.</h2>
        <p class="consultation-modal__intro" id="consultation-description">Share a little context first. Once your request is received, you’ll continue directly to available consultation times.</p>

        <form class="consultation-form" method="post" novalidate data-consultation-form>
          <input name="requestToken" type="hidden" value="">

          <div class="consultation-field">
            <label for="consultation-name">Name *</label>
            <input id="consultation-name" name="name" type="text" autocomplete="name" maxlength="120" required aria-describedby="consultation-name-error">
            <p class="consultation-field__error" id="consultation-name-error" data-error-for="name"></p>
          </div>

          <div class="consultation-field">
            <label for="consultation-email">Email *</label>
            <input id="consultation-email" name="email" type="email" autocomplete="email" maxlength="254" required aria-describedby="consultation-email-error">
            <p class="consultation-field__error" id="consultation-email-error" data-error-for="email"></p>
          </div>

          <div class="consultation-field">
            <label for="consultation-company">Company / Organisation <span>(optional)</span></label>
            <input id="consultation-company" name="company" type="text" autocomplete="organization" maxlength="160" aria-describedby="consultation-company-error">
            <p class="consultation-field__error" id="consultation-company-error" data-error-for="company"></p>
          </div>

          <div class="consultation-field">
            <label for="consultation-website">Website <span>(optional)</span></label>
            <input id="consultation-website" name="website" type="url" inputmode="url" autocomplete="url" maxlength="500" placeholder="https://example.com" aria-describedby="consultation-website-error">
            <p class="consultation-field__error" id="consultation-website-error" data-error-for="website"></p>
          </div>

          <div class="consultation-field consultation-field--full">
            <label for="consultation-interest">What would you like help with? *</label>
            <select id="consultation-interest" name="aiInterest" required aria-describedby="consultation-interest-error">
              <option value="">Select an area</option>
              <option>AI Strategy &amp; Opportunity Mapping</option>
              <option>AI Automation &amp; Workflows</option>
              <option>AI Assistants / Agents</option>
              <option>AI-Powered Business Tools</option>
              <option>Generative AI</option>
              <option>AI Video / Digital Experiences</option>
              <option>Other</option>
            </select>
            <p class="consultation-field__error" id="consultation-interest-error" data-error-for="aiInterest"></p>
          </div>

          <div class="consultation-field consultation-field--full">
            <label for="consultation-message">Tell me briefly about the opportunity or challenge. *</label>
            <textarea id="consultation-message" name="message" maxlength="3000" required aria-describedby="consultation-message-error"></textarea>
            <p class="consultation-field__error" id="consultation-message-error" data-error-for="message"></p>
          </div>

          <div class="consultation-honeypot" aria-hidden="true">
            <label for="consultation-fax">Fax number</label>
            <input id="consultation-fax" name="faxNumber" type="text" tabindex="-1" autocomplete="off">
          </div>

          <p class="consultation-form__privacy">By continuing, you agree that the information you provide may be used to respond to your consultation request and arrange your meeting.</p>

          <div class="consultation-form__actions">
            <button class="consultation-form__submit" type="submit" data-consultation-submit>Continue to Scheduling</button>
            <button class="consultation-form__cancel" type="button" data-consultation-close>Cancel</button>
          </div>
          <p class="consultation-form__status" role="status" aria-live="polite" data-consultation-status></p>
        </form>
      </div>
    </div>
    <iframe class="consultation-response-frame" name="consultation-response-frame" title="Consultation form response" data-consultation-frame></iframe>`;

  document.body.insertAdjacentHTML('beforeend', modalMarkup);

  const finalCta = document.querySelector('#contact .hero-actions .button[aria-disabled="true"]');
  if (finalCta) {
    const replacement = document.createElement('button');
    replacement.type = 'button';
    replacement.className = finalCta.className;
    replacement.textContent = finalCta.textContent;
    finalCta.replaceWith(replacement);
  }

  const triggerCandidates = [
    document.querySelector('.header-cta'),
    document.querySelector('.mobile-menu .button[href="#contact"]'),
    document.querySelector('.hero .hero-actions .button[href="#contact"]'),
    document.querySelector('.projects-carousel-section .section-head > .outline-button[href="#contact"]'),
    document.querySelector('#contact .hero-actions .button')
  ].filter(Boolean);

  triggerCandidates.forEach((trigger) => {
    trigger.setAttribute('data-consultation-trigger', '');
    trigger.setAttribute('aria-haspopup', 'dialog');
  });

  const note = document.querySelector('#contact .cta-note');
  if (note) {
    note.textContent = 'Share a little context first, then choose an available consultation time. Your request is saved before scheduling so the conversation can continue even if you do not complete the booking.';
  }

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
  let activeRequestToken = '';

  const fields = {
    name: form.elements.namedItem('name'),
    email: form.elements.namedItem('email'),
    company: form.elements.namedItem('company'),
    website: form.elements.namedItem('website'),
    aiInterest: form.elements.namedItem('aiInterest'),
    message: form.elements.namedItem('message'),
    requestToken: form.elements.namedItem('requestToken')
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

    Object.entries(fields).forEach(([name, field]) => {
      if (name !== 'requestToken' && field) setFieldError(field, '');
    });

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

  function newRequestToken() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  }

  function calendlyDestination() {
    const url = new URL(CALENDLY_URL);
    const name = fields.name?.value.trim();
    const email = fields.email?.value.trim();
    if (name) url.searchParams.set('name', name);
    if (email) url.searchParams.set('email', email);
    return url.toString();
  }

  function isGoogleScriptOrigin(origin) {
    if (origin === 'null') return true;
    try {
      const hostname = new URL(origin).hostname;
      return hostname === 'script.google.com' || hostname.endsWith('.googleusercontent.com');
    } catch {
      return false;
    }
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

    activeRequestToken = newRequestToken();
    if (fields.requestToken) fields.requestToken.value = activeRequestToken;

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
    }, 20000);

    form.submit();
  });

  window.addEventListener('message', (event) => {
    if (!isGoogleScriptOrigin(event.origin)) return;
    const data = event.data;
    if (!data || data.type !== 'consultation-form-result' || !data.payload) return;
    if (!activeRequestToken || data.payload.requestToken !== activeRequestToken) return;

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
