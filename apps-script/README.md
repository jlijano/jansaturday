# AI Consultation Apps Script Backend

This folder contains the Google Apps Script backend used by the website consultation popup.

## Field mapping

Website form field -> Google Sheet column

- `name` -> Name
- `email` -> Email
- `company` -> Company / Organisation
- `website` -> Website
- `aiInterest` -> AI Interest
- `message` -> Message
- `faxNumber` -> honeypot only; must remain blank and is not stored

The backend automatically writes:

- Timestamp -> current submission time
- Status -> `Awaiting Scheduling`
- Calendly Booking Status -> `Not Booked`
- Meeting Date / Time -> blank until scheduling is completed
- Notes -> `Submitted from website consultation popup`

## Required sheet

The script must be bound to the Google Sheet that contains a tab named exactly:

`Consultation Leads`

Required header row, in order:

`Timestamp | Name | Email | Company / Organisation | Website | AI Interest | Message | Status | Calendly Booking Status | Meeting Date / Time | Notes`

## Deployment

1. Open the target Google Sheet while signed in to `j.saturday.ai@gmail.com`.
2. Go to `Extensions -> Apps Script`.
3. Replace the default `Code.gs` content with the contents of this repository's `apps-script/Code.gs`.
4. Save the project.
5. Choose `Deploy -> New deployment -> Web app`.
6. Execute as: `Me`.
7. Who has access: choose the option that allows website visitors to submit without signing in.
8. Authorize the requested Google Sheets and email permissions.
9. Copy the deployed Web App URL ending in `/exec`.
10. Use that URL as the popup form `action` on the website.

## Website submission contract

Use a normal `POST` form targeting a hidden iframe. The backend returns a small HTML document that sends a `postMessage` event back to the website. This avoids relying on cross-origin AJAX/CORS behavior from Apps Script.

Expected form input `name` attributes:

```html
name="name"
name="email"
name="company"
name="website"
name="aiInterest"
name="message"
name="faxNumber"
```

The website should listen for:

```js
message.data.type === 'consultation-form-result'
```

and then inspect:

```js
message.data.payload.ok
message.data.payload.message
```

Only accept that message when `message.origin` is the expected Google Apps Script response origin used by the deployed web app flow, and keep the backend `allowedParentOrigin` set to the production website origin:

`https://jansaturday-1.onrender.com`

## AI Interest values

The form must submit one of these exact values:

- AI Strategy & Opportunity Mapping
- AI Automation & Workflows
- AI Assistants / Agents
- AI-Powered Business Tools
- Generative AI
- AI Video / Digital Experiences
- Other

## Email notification

Successful submissions send a lead notification to:

`j.saturday.ai@gmail.com`

The notification's Reply-To address is the visitor's submitted email address.

## Security and validation

The backend includes:

- required-field validation
- email validation
- optional website URL validation
- strict allow-list validation for AI Interest
- field-length limits
- HTML escaping in notification emails
- a honeypot field for basic bot filtering
- a script lock to reduce simultaneous-write collisions
- generic public error messages for unexpected backend errors
- exact Sheet header verification before data is written

Do not place passwords, API keys, Calendly secrets, or Google credentials in this repository or in the website JavaScript.
