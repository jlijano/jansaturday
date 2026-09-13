const CONFIG = Object.freeze({
  spreadsheetId: '1zqLyFmub3w5IlQT_JYuk1L-cv1MyJUKuWeC7_doyqi4',
  sheetName: 'Consultation Leads',
  notificationEmail: 'j.saturday.ai@gmail.com',
  calendlyUrl: 'https://calendly.com/j-saturday-ai',
  allowedParentOrigin: 'https://jansaturday-1.onrender.com',
  statuses: Object.freeze({
    lead: 'Awaiting Scheduling',
    booking: 'Not Booked'
  }),
  allowedInterests: Object.freeze([
    'AI Strategy & Opportunity Mapping',
    'AI Automation & Workflows',
    'AI Assistants / Agents',
    'AI-Powered Business Tools',
    'Generative AI',
    'AI Video / Digital Experiences',
    'Other'
  ])
});

function doPost(e) {
  try {
    const payload = normalizePayload_(e && e.parameter ? e.parameter : {});
    validatePayload_(payload);

    if (payload.faxNumber) {
      return responseHtml_({ ok: true, ignored: true, requestToken: payload.requestToken });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    let rowNumber;
    let sheet;
    try {
      const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
      sheet = spreadsheet.getSheetByName(CONFIG.sheetName);
      if (!sheet) throw new Error('Required sheet not found: ' + CONFIG.sheetName);

      assertHeaders_(sheet);

      sheet.appendRow([
        new Date(),
        payload.name,
        payload.email,
        payload.company,
        payload.website,
        payload.aiInterest,
        payload.message,
        CONFIG.statuses.lead,
        CONFIG.statuses.booking,
        '',
        'Submitted from website consultation popup'
      ]);

      rowNumber = sheet.getLastRow();
    } finally {
      lock.releaseLock();
    }

    const delivery = {
      internalEmail: true,
      clientEmail: true
    };

    try {
      sendLeadNotification_(payload, rowNumber);
    } catch (error) {
      console.error('Internal notification email failed', error);
      delivery.internalEmail = false;
      appendNote_(sheet, rowNumber, 'Internal notification email failed.');
    }

    try {
      sendClientReceipt_(payload);
    } catch (error) {
      console.error('Client receipt email failed', error);
      delivery.clientEmail = false;
      appendNote_(sheet, rowNumber, 'Client receipt email failed.');
    }

    return responseHtml_({
      ok: true,
      row: rowNumber,
      requestToken: payload.requestToken,
      delivery: delivery,
      message: 'Consultation request received.'
    });
  } catch (error) {
    console.error(error);
    const raw = e && e.parameter ? e.parameter : {};
    return responseHtml_({
      ok: false,
      requestToken: cleanText_(raw.requestToken, 120),
      message: publicErrorMessage_(error)
    });
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'AI Consultation Lead Intake' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function normalizePayload_(raw) {
  return {
    name: cleanText_(raw.name, 120),
    email: cleanText_(raw.email, 254).toLowerCase(),
    company: cleanText_(raw.company, 160),
    website: cleanText_(raw.website, 500),
    aiInterest: cleanText_(raw.aiInterest, 120),
    message: cleanText_(raw.message, 3000),
    requestToken: cleanText_(raw.requestToken, 120),
    faxNumber: cleanText_(raw.faxNumber, 200)
  };
}

function validatePayload_(payload) {
  if (!payload.name) throw new Error('VALIDATION:Please enter your name.');
  if (!payload.email) throw new Error('VALIDATION:Please enter your email address.');
  if (!isValidEmail_(payload.email)) throw new Error('VALIDATION:Please enter a valid email address.');
  if (!payload.aiInterest) throw new Error('VALIDATION:Please choose what you would like to explore with AI.');
  if (CONFIG.allowedInterests.indexOf(payload.aiInterest) === -1) {
    throw new Error('VALIDATION:Please choose a valid AI interest.');
  }
  if (!payload.message) throw new Error('VALIDATION:Please tell me briefly about the opportunity or challenge.');
  if (!payload.requestToken) throw new Error('VALIDATION:Please refresh the page and try again.');

  if (payload.website && !isValidWebsite_(payload.website)) {
    throw new Error('VALIDATION:Please enter a valid website URL, or leave the website field blank.');
  }
}

function assertHeaders_(sheet) {
  const expected = [
    'Timestamp',
    'Name',
    'Email',
    'Company / Organisation',
    'Website',
    'AI Interest',
    'Message',
    'Status',
    'Calendly Booking Status',
    'Meeting Date / Time',
    'Notes'
  ];

  const actual = sheet.getRange(1, 1, 1, expected.length).getDisplayValues()[0];
  const matches = expected.every(function (header, index) {
    return actual[index] === header;
  });

  if (!matches) {
    throw new Error('The Consultation Leads sheet headers do not match the expected backend mapping.');
  }
}

function sendLeadNotification_(payload, rowNumber) {
  const subject = 'New AI Consultation Request — ' + payload.name;
  const plainBody = [
    'A new consultation request was submitted from the website.',
    '',
    'Name: ' + payload.name,
    'Email: ' + payload.email,
    'Company / Organisation: ' + (payload.company || 'Not provided'),
    'Website: ' + (payload.website || 'Not provided'),
    'AI Interest: ' + payload.aiInterest,
    '',
    'Message:',
    payload.message,
    '',
    'Status: ' + CONFIG.statuses.lead,
    'Calendly Booking Status: ' + CONFIG.statuses.booking,
    'Sheet row: ' + rowNumber
  ].join('\n');

  const htmlBody = [
    '<p>A new consultation request was submitted from the website.</p>',
    '<p><strong>Name:</strong> ' + escapeHtml_(payload.name) + '<br>',
    '<strong>Email:</strong> ' + escapeHtml_(payload.email) + '<br>',
    '<strong>Company / Organisation:</strong> ' + escapeHtml_(payload.company || 'Not provided') + '<br>',
    '<strong>Website:</strong> ' + escapeHtml_(payload.website || 'Not provided') + '<br>',
    '<strong>AI Interest:</strong> ' + escapeHtml_(payload.aiInterest) + '</p>',
    '<p><strong>Message:</strong><br>' + escapeHtml_(payload.message).replace(/\n/g, '<br>') + '</p>',
    '<p><strong>Status:</strong> ' + escapeHtml_(CONFIG.statuses.lead) + '<br>',
    '<strong>Calendly Booking Status:</strong> ' + escapeHtml_(CONFIG.statuses.booking) + '<br>',
    '<strong>Sheet row:</strong> ' + rowNumber + '</p>'
  ].join('');

  MailApp.sendEmail({
    to: CONFIG.notificationEmail,
    subject: subject,
    body: plainBody,
    htmlBody: htmlBody,
    replyTo: payload.email,
    name: 'Jan Lijano Website'
  });
}

function sendClientReceipt_(payload) {
  const subject = 'Thanks for your AI consultation request';
  const plainBody = [
    'Hi ' + payload.name + ',',
    '',
    'Thanks for reaching out. Your AI consultation request has been received.',
    '',
    'You can now continue with scheduling in Calendly. Once your time is booked, Calendly will send the calendar invitation and meeting details.',
    '',
    'Best,',
    'Jan Lijano',
    'AI Consultant'
  ].join('\n');

  const htmlBody = [
    '<p>Hi ' + escapeHtml_(payload.name) + ',</p>',
    '<p>Thanks for reaching out. Your AI consultation request has been received.</p>',
    '<p>You can now continue with scheduling in Calendly. Once your time is booked, Calendly will send the calendar invitation and meeting details.</p>',
    '<p>Best,<br>Jan Lijano<br>AI Consultant</p>'
  ].join('');

  MailApp.sendEmail({
    to: payload.email,
    subject: subject,
    body: plainBody,
    htmlBody: htmlBody,
    replyTo: CONFIG.notificationEmail,
    name: 'Jan Lijano'
  });
}

function buildCalendlyUrl_(name, email) {
  const params = [];
  if (name) params.push('name=' + encodeURIComponent(name));
  if (email) params.push('email=' + encodeURIComponent(email));
  if (!params.length) return CONFIG.calendlyUrl;
  return CONFIG.calendlyUrl + (CONFIG.calendlyUrl.indexOf('?') === -1 ? '?' : '&') + params.join('&');
}

function appendNote_(sheet, rowNumber, note) {
  if (!sheet || !rowNumber) return;
  const cell = sheet.getRange(rowNumber, 11);
  const existing = String(cell.getDisplayValue() || '').trim();
  cell.setValue(existing ? existing + '\n' + note : note);
}

function responseHtml_(result) {
  const safeJson = JSON.stringify(result).replace(/</g, '\\u003c');
  const safeOrigin = JSON.stringify(CONFIG.allowedParentOrigin);
  const html = [
    '<!doctype html><html><head><meta charset="utf-8"></head><body>',
    '<script>',
    'window.top.postMessage({type:"consultation-form-result",payload:' + safeJson + '},' + safeOrigin + ');',
    '</script>',
    '</body></html>'
  ].join('');

  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function publicErrorMessage_(error) {
  const message = String(error && error.message ? error.message : error);
  if (message.indexOf('VALIDATION:') === 0) return message.substring('VALIDATION:'.length);
  return 'We could not save your consultation request. Please try again.';
}

function cleanText_(value, maxLength) {
  const text = String(value == null ? '' : value)
    .replace(/\u0000/g, '')
    .trim();
  return text.substring(0, maxLength);
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidWebsite_(value) {
  try {
    const normalized = /^https?:\/\//i.test(value) ? value : 'https://' + value;
    const url = new URL(normalized);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
