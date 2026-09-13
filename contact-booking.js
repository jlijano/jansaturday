(() => {
  if (window.__contactBookingInstalled) return;
  window.__contactBookingInstalled = true;

  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbxMkAafaG1IRUvC7HF-cfBgEWuwFEHf6WNnzcr3WbRikTONN85N7MSCVkDr5ct5MJQn/exec';
  const CALENDLY_URL = 'https://calendly.com/j-saturday-ai';
  const form = document.querySelector('[data-inline-consultation-form]');
  const frame = document.querySelector('[data-consultation-frame]');
  if (!form || !frame) return;

  /* Keep the inline booking form field-for-field aligned with the consultation modal. */
  form.innerHTML = `
    <input name="requestToken" type="hidden" value="">

    <div class="contact-booking-field">
      <label for="booking-name">Name *</label>
      <input id="booking-name" name="name" type="text" autocomplete="name" maxlength="120" required aria-describedby="booking-name-error">
      <p class="contact-booking-error" id="booking-name-error" data-inline-error-for="name"></p>
    </div>

    <div class="contact-booking-field">
      <label for="booking-email">Email *</label>
      <input id="booking-email" name="email" type="email" autocomplete="email" maxlength="254" required aria-describedby="booking-email-error">
      <p class="contact-booking-error" id="booking-email-error" data-inline-error-for="email"></p>
    </div>

    <div class="contact-booking-field">
      <label for="booking-company">Company / Organisation <span>(optional)</span></label>
      <input id="booking-company" name="company" type="text" autocomplete="organization" maxlength="160" aria-describedby="booking-company-error">
      <p class="contact-booking-error" id="booking-company-error" data-inline-error-for="company"></p>
    </div>

    <div class="contact-booking-field">
      <label for="booking-website">Website <span>(optional)</span></label>
      <input id="booking-website" name="website" type="url" inputmode="url" autocomplete="url" maxlength="500" placeholder="https://example.com" aria-describedby="booking-website-error">
      <p class="contact-booking-error" id="booking-website-error" data-inline-error-for="website"></p>
    </div>

    <div class="contact-booking-field">
      <label for="booking-interest">What would you like help with? *</label>
      <select id="booking-interest" name="aiInterest" required aria-describedby="booking-interest-error">
        <option value="">Select an area</option>
        <option>AI Strategy &amp; Opportunity Mapping</option>
        <option>AI Automation &amp; Workflows</option>
        <option>AI Assistants / Agents</option>
        <option>AI-Powered Business Tools</option>
        <option>Generative AI</option>
        <option>AI Video / Digital Experiences</option>
        <option>Other</option>
      </select>
      <p class="contact-booking-error" id="booking-interest-error" data-inline-error-for="aiInterest"></p>
    </div>

    <div class="contact-booking-field">
      <label for="booking-message">Tell me briefly about the opportunity or challenge. *</label>
      <textarea id="booking-message" name="message" maxlength="3000" required aria-describedby="booking-message-error"></textarea>
      <p class="contact-booking-error" id="booking-message-error" data-inline-error-for="message"></p>
    </div>

    <div class="consultation-honeypot" aria-hidden="true">
      <label for="booking-fax">Fax number</label>
      <input id="booking-fax" name="faxNumber" type="text" tabindex="-1" autocomplete="off">
    </div>

    <p class="contact-booking-privacy">By continuing, you agree that the information you provide may be used to respond to your consultation request and arrange your meeting.</p>
    <button class="contact-booking-submit" type="submit" data-inline-consultation-submit>Continue to Scheduling</button>
    <p class="contact-booking-note">Your request is saved before scheduling so the conversation can continue even if you do not complete the booking.</p>
    <p class="contact-booking-status" role="status" aria-live="polite" data-inline-consultation-status></p>
  `;

  const submit = form.querySelector('[data-inline-consultation-submit]');
  const status = form.querySelector('[data-inline-consultation-status]');
  if (!submit || !status) return;

  /* Use the same brand image as the header, then remove its light background for a transparent logo. */
  const installContactLogo = (attempt = 0) => {
    const brand = document.querySelector('.contact-brand-mark');
    if (!brand) return;
    const source = document.querySelector('.brand--logo img, .brand img');
    if (!source?.src) {
      if (attempt < 30) window.setTimeout(() => installContactLogo(attempt + 1), 100);
      return;
    }

    const logo = document.createElement('img');
    logo.className = 'contact-brand-logo';
    logo.alt = 'Jan Lijano AI Consulting';
    logo.decoding = 'async';

    const image = new Image();
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth || image.width;
        canvas.height = image.naturalHeight || image.height;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) throw new Error('Canvas context unavailable');
        context.drawImage(image, 0, 0);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        for (let index = 0; index < pixels.length; index += 4) {
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          if (red > 232 && green > 228 && blue > 218) {
            const brightness = (red + green + blue) / 3;
            pixels[index + 3] = brightness >= 247 ? 0 : Math.min(pixels[index + 3], Math.max(0, Math.min(255, Math.round(((247 - brightness) / 15) * 255))));
          }
        }
        context.putImageData(imageData, 0, 0);
        logo.src = canvas.toDataURL('image/png');
      } catch {
        logo.src = source.src;
      }
      brand.replaceChildren(logo);
    };
    image.onerror = () => { logo.src = source.src; brand.replaceChildren(logo); };
    image.src = source.src;

    if (!document.querySelector('#contact-booking-final-style')) {
      const style = document.createElement('style');
      style.id = 'contact-booking-final-style';
      style.textContent = `
        .contact-brand-mark{display:block!important;width:min(100%,285px)!important;margin-bottom:48px!important}
        .contact-brand-logo{display:block;width:100%;max-width:285px;height:auto;object-fit:contain;object-position:left center;background:transparent!important}
        .contact-booking-form{gap:12px!important}
        .contact-booking-field{display:grid!important;gap:7px!important}
        .contact-booking-field label{color:#4e0911;font-size:.84rem;font-weight:800;line-height:1.3}
        .contact-booking-field label span{color:#8d7176;font-weight:600}
        .contact-booking-form input,.contact-booking-form select,.contact-booking-form textarea{width:100%;border:1px solid rgba(78,9,17,.18)!important;border-radius:15px!important;background:rgba(255,255,255,.72)!important;color:#2b1115!important;padding:13px 14px!important;outline:none;font:inherit;box-shadow:inset 0 1px 0 rgba(255,255,255,.72);transition:border-color .18s ease,box-shadow .18s ease,background .18s ease}
        .contact-booking-form input,.contact-booking-form select{min-height:49px}
        .contact-booking-form textarea{min-height:126px!important;resize:vertical}
        .contact-booking-form input:focus,.contact-booking-form select:focus,.contact-booking-form textarea:focus{border-color:#4e0911!important;background:rgba(255,255,255,.94)!important;box-shadow:0 0 0 4px rgba(78,9,17,.09),inset 0 1px 0 rgba(255,255,255,.8)!important}
        .contact-booking-form [aria-invalid="true"]{border-color:#b3261e!important;background:rgba(255,247,245,.94)!important}
        .contact-booking-error{min-height:17px!important;margin:0!important;color:#a22620!important;font-size:.76rem!important;line-height:1.35!important}
        .contact-booking-privacy{margin:0!important;color:#735a5f!important;font-size:.78rem!important;line-height:1.5!important}
        .contact-booking-submit{min-height:50px!important;margin-top:2px}
        @media(max-width:900px){.contact-brand-mark{width:min(100%,250px)!important;margin-bottom:34px!important}.contact-brand-logo{max-width:250px}}
        @media(max-width:640px){.contact-brand-mark{width:min(100%,225px)!important;margin-bottom:28px!important}.contact-brand-logo{max-width:225px}}
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
    website: form.elements.namedItem('website'),
    aiInterest: form.elements.namedItem('aiInterest'),
    message: form.elements.namedItem('message'),
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
    ['name', 'email', 'company', 'website', 'aiInterest', 'message'].forEach((key) => fields[key] && setError(fields[key], ''));

    if (!fields.name?.value.trim()) { setError(fields.name, 'Please enter your name.'); valid = false; }
    if (!fields.email?.value.trim()) { setError(fields.email, 'Please enter your email address.'); valid = false; }
    else if (!emailPattern.test(fields.email.value.trim())) { setError(fields.email, 'Please enter a valid email address.'); valid = false; }
    if (!fields.aiInterest?.value) { setError(fields.aiInterest, 'Please choose an AI area to explore.'); valid = false; }
    if (!fields.message?.value.trim()) { setError(fields.message, 'Please tell me briefly about the opportunity or challenge.'); valid = false; }

    if (fields.website?.value.trim()) {
      try {
        const raw = fields.website.value.trim();
        const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid protocol');
      } catch {
        setError(fields.website, 'Please enter a valid website URL or leave this blank.');
        valid = false;
      }
    }

    if (!valid) {
      status.textContent = 'Please review the highlighted fields.';
      status.dataset.state = 'error';
      form.querySelector('[aria-invalid="true"]')?.focus();
    }
    return valid;
  };

  const token = () => window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  const setSubmitting = (value) => {
    submitting = value;
    submit.disabled = value;
    submit.textContent = value ? 'Sending your details…' : 'Continue to Scheduling';
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
  form.addEventListener('change', (event) => {
    if (event.target instanceof HTMLElement && event.target.hasAttribute('name')) setError(event.target, '');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (submitting || !validate()) return;

    activeRequestToken = token();
    fields.requestToken.value = activeRequestToken;
    status.textContent = 'Sending your details…';
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
