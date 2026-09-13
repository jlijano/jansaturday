(() => {
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbxMkAafaG1IRUvC7HF-cfBgEWuwFEHf6WNnzcr3WbRikTONN85N7MSCVkDr5ct5MJQn/exec';
  const CALENDLY_URL = 'https://calendly.com/j-saturday-ai';
  const form = document.querySelector('[data-inline-consultation-form]');
  const submit = document.querySelector('[data-inline-consultation-submit]');
  const status = document.querySelector('[data-inline-consultation-status]');
  const frame = document.querySelector('[data-consultation-frame]');
  if (!form || !submit || !status || !frame) return;

  const installContactLogo = (attempt = 0) => {
    const brand = document.querySelector('.contact-brand-mark');
    if (!brand || brand.querySelector('.contact-brand-logo')) return;

    const source = document.querySelector('.brand--logo img, .brand img');
    if (!source?.src) {
      if (attempt < 20) window.setTimeout(() => installContactLogo(attempt + 1), 100);
      return;
    }

    const logo = document.createElement('img');
    logo.className = 'contact-brand-logo';
    logo.src = source.src;
    logo.alt = 'Jan Lijano AI Consulting';
    logo.decoding = 'async';
    brand.replaceChildren(logo);

    if (!document.querySelector('#contact-brand-logo-style')) {
      const style = document.createElement('style');
      style.id = 'contact-brand-logo-style';
      style.textContent = `
        .contact-brand-mark{display:block!important;width:min(100%,270px)!important;margin-bottom:52px!important;color:inherit!important}
        .contact-brand-logo{display:block;width:100%;max-width:270px;height:auto;object-fit:contain;object-position:left center;background:transparent}
        @media(max-width:900px){.contact-brand-mark{width:min(100%,240px)!important;margin-bottom:34px!important}.contact-brand-logo{max-width:240px}}
        @media(max-width:640px){.contact-brand-mark{width:min(100%,220px)!important;margin-bottom:28px!important}.contact-brand-logo{max-width:220px}}
      `;
      document.head.appendChild(style);
    }
  };

  installContactLogo();

  let activeRequestToken = '';
  let timer = null;
  let submitting = false;

  const fields = {
    name: form.elements.namedItem('name'),
    email: form.elements.namedItem('email'),
    company: form.elements.namedItem('company'),
    message: form.elements.namedItem('message'),
    aiInterest: form.elements.namedItem('aiInterest'),
    requestToken: form.elements.namedItem('requestToken')
  };

  const setError = (field, message) => {
    if (!(field instanceof HTMLElement)) return;
    const target = form.querySelector(`[data-inline-error-for="${field.getAttribute('name')}"]`);
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (target) target.textContent = message || '';
  };

  const validate = () => {
    let valid = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    ['name','email','company','message'].forEach((key) => fields[key] && setError(fields[key], ''));

    if (!fields.name?.value.trim()) { setError(fields.name, 'Please enter your name.'); valid = false; }
    if (!fields.email?.value.trim()) { setError(fields.email, 'Please enter your work email.'); valid = false; }
    else if (!emailPattern.test(fields.email.value.trim())) { setError(fields.email, 'Please enter a valid email address.'); valid = false; }
    if (!fields.message?.value.trim()) { setError(fields.message, 'Please tell me briefly what you would like to discuss.'); valid = false; }

    if (!valid) {
      status.textContent = 'Please review the highlighted fields.';
      status.dataset.state = 'error';
      form.querySelector('[aria-invalid="true"]')?.focus();
    }
    return valid;
  };

  const token = () => window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const setSubmitting = (value) => {
    submitting = value;
    submit.disabled = value;
    submit.textContent = value ? 'Saving your request…' : 'Request a Discovery Call';
  };

  const schedulingUrl = () => {
    const url = new URL(CALENDLY_URL);
    if (fields.name?.value.trim()) url.searchParams.set('name', fields.name.value.trim());
    if (fields.email?.value.trim()) url.searchParams.set('email', fields.email.value.trim());
    return url.toString();
  };

  const trustedOrigin = (origin) => {
    if (origin === 'null') return true;
    try {
      const host = new URL(origin).hostname;
      return host === 'script.google.com' || host.endsWith('.googleusercontent.com');
    } catch { return false; }
  };

  form.addEventListener('input', (event) => {
    if (event.target instanceof HTMLElement && event.target.hasAttribute('name')) setError(event.target, '');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (submitting || !validate()) return;
    activeRequestToken = token();
    fields.requestToken.value = activeRequestToken;
    status.textContent = 'Saving your request…';
    status.removeAttribute('data-state');
    setSubmitting(true);
    form.action = ENDPOINT;
    form.target = frame.name;
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (!submitting) return;
      setSubmitting(false);
      status.textContent = 'We could not confirm your request. Please try again.';
      status.dataset.state = 'error';
    }, 20000);
    form.submit();
  });

  window.addEventListener('message', (event) => {
    if (!trustedOrigin(event.origin)) return;
    const data = event.data;
    if (!data || data.type !== 'consultation-form-result' || !data.payload) return;
    if (!activeRequestToken || data.payload.requestToken !== activeRequestToken) return;
    clearTimeout(timer);
    if (data.payload.ok) {
      setSubmitting(false);
      status.textContent = 'Request received. Opening available consultation times…';
      status.dataset.state = 'success';
      window.setTimeout(() => window.location.assign(schedulingUrl()), 700);
      return;
    }
    setSubmitting(false);
    status.textContent = data.payload.message || 'We could not save your consultation request. Please try again.';
    status.dataset.state = 'error';
  });

  document.querySelectorAll('a[href="#about"]').forEach((link) => {
    if (!document.querySelector('#about')) link.remove();
  });
})();
