/**
 * The Aesculapius Foundation
 * Advisory Board Application form handler
 *
 * Deployment model:
 * 1. Create a Google Sheet for advisory board applications.
 * 2. Extensions -> Apps Script.
 * 3. Paste this file into Code.gs.
 * 4. Set SCRIPT PROPERTIES:
 *    - SPREADSHEET_ID: the Google Sheet ID
 *    - TO_EMAIL: contact@aesculapiusfoundation.org
 *    - CC_EMAIL: optional internal copy address
 *    - FROM_NAME: The Aesculapius Foundation
 * 5. Deploy -> New deployment -> Web app.
 *    Execute as: Me
 *    Who has access: Anyone
 * 6. Copy the web app URL and replace the placeholder action URL in advisory.html.
 */

const REQUIRED_FIELDS = [
  'name',
  'title',
  'organization',
  'email',
  'expertise',
  'interest',
  'contribution',
  'consent'
];

const HEADERS = [
  'Timestamp',
  'Form Type',
  'Name',
  'Title / Role',
  'Organization / Affiliation',
  'Email',
  'Phone',
  'Website / Profile URL',
  'Primary Area of Expertise',
  'Geographic Location',
  'Interest Statement',
  'Contribution / Perspective',
  'Biography / Background',
  'Potential Conflicts',
  'Availability',
  'Referral Source',
  'Contact Consent',
  'Public Listing Consent',
  'User Agent'
];

function doPost(e) {
  try {
    const data = normalizePostData_(e);
    validate_(data);

    const sheet = getOrCreateSheet_();
    ensureHeaders_(sheet);
    sheet.appendRow(buildRow_(data, e));

    sendNotification_(data);
    sendApplicantReceipt_(data);

    return htmlResponse_(
      'Thank you. Your advisory board application has been received. The Foundation will review your submission and follow up if there may be a fit.'
    );
  } catch (error) {
    console.error(error);
    return htmlResponse_(
      'We could not process the submission. Please go back, confirm all required fields are complete, and try again. You may also email contact@aesculapiusfoundation.org.',
      400
    );
  }
}

function doGet() {
  return htmlResponse_('The advisory board application endpoint is active.');
}

function normalizePostData_(e) {
  const params = (e && e.parameter) ? e.parameter : {};
  const clean = {};
  Object.keys(params).forEach(function(key) {
    clean[key] = String(params[key] || '').trim();
  });
  return clean;
}

function validate_(data) {
  REQUIRED_FIELDS.forEach(function(field) {
    if (!data[field]) {
      throw new Error('Missing required field: ' + field);
    }
  });
  if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    throw new Error('Invalid email address');
  }
}

function getOrCreateSheet_() {
  const props = PropertiesService.getScriptProperties();
  const spreadsheetId = props.getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) {
    throw new Error('Missing SPREADSHEET_ID script property');
  }

  const ss = SpreadsheetApp.openById(spreadsheetId);
  const sheetName = 'Advisory Board Applications';
  return ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
}

function ensureHeaders_(sheet) {
  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const hasHeaders = firstRow.some(function(value) { return value; });
  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
}

function buildRow_(data, e) {
  return [
    new Date(),
    data.formType || 'Advisory Board Application',
    data.name,
    data.title,
    data.organization,
    data.email,
    data.phone,
    data.website,
    data.expertise,
    data.location,
    data.interest,
    data.contribution,
    data.bio,
    data.conflicts,
    data.availability,
    data.referral,
    data.consent,
    data.publishConsent || 'No',
    getUserAgent_(e)
  ];
}

function getUserAgent_(e) {
  try {
    return e && e.postData && e.postData.type ? e.postData.type : '';
  } catch (error) {
    return '';
  }
}

function sendNotification_(data) {
  const props = PropertiesService.getScriptProperties();
  const toEmail = props.getProperty('TO_EMAIL') || 'contact@aesculapiusfoundation.org';
  const ccEmail = props.getProperty('CC_EMAIL') || '';
  const subject = 'New Advisory Board Application - ' + data.name;
  const body = [
    'A new advisory board application has been submitted.',
    '',
    'Name: ' + data.name,
    'Title / Role: ' + data.title,
    'Organization: ' + data.organization,
    'Email: ' + data.email,
    'Phone: ' + (data.phone || ''),
    'Website / Profile: ' + (data.website || ''),
    'Expertise: ' + data.expertise,
    'Location: ' + (data.location || ''),
    'Availability: ' + (data.availability || ''),
    'Referral Source: ' + (data.referral || ''),
    '',
    'Interest:',
    data.interest || '',
    '',
    'Contribution / Perspective:',
    data.contribution || '',
    '',
    'Biography / Background:',
    data.bio || '',
    '',
    'Potential Conflicts:',
    data.conflicts || '',
    '',
    'Contact Consent: ' + data.consent,
    'Public Listing Consent: ' + (data.publishConsent || 'No')
  ].join('\n');

  const options = {
    name: props.getProperty('FROM_NAME') || 'The Aesculapius Foundation Website'
  };
  if (ccEmail) options.cc = ccEmail;

  MailApp.sendEmail(toEmail, subject, body, options);
}

function sendApplicantReceipt_(data) {
  const props = PropertiesService.getScriptProperties();
  const subject = 'We received your advisory board application';
  const body = [
    'Dear ' + data.name + ',',
    '',
    'Thank you for your interest in serving as an advisory board member for The Aesculapius Foundation.',
    '',
    'We have received your submission. The Foundation will review your background, interests, and potential fit with current advisory needs. If there may be a fit, we will follow up to schedule an introductory conversation and discuss any next steps, including conflict-of-interest disclosure and advisory board documentation.',
    '',
    'Sincerely,',
    'The Aesculapius Foundation',
    'contact@aesculapiusfoundation.org'
  ].join('\n');

  MailApp.sendEmail(data.email, subject, body, {
    name: props.getProperty('FROM_NAME') || 'The Aesculapius Foundation'
  });
}

function htmlResponse_(message, statusCode) {
  const safeMessage = String(message).replace(/[<>&]/g, function(char) {
    return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[char];
  });
  const html = '<!doctype html><html><head><base target="_top"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{font-family:Arial,sans-serif;line-height:1.5;padding:2rem;max-width:720px;margin:auto;color:#233;}a{color:#245;}</style></head><body><h1>Advisory Board Application</h1><p>' + safeMessage + '</p><p><a href="https://www.aesculapiusfoundation.org/advisory.html">Return to the advisory board page</a></p></body></html>';
  const output = HtmlService.createHtmlOutput(html);
  if (statusCode) {
    // HtmlService does not support setting HTTP status codes for web apps.
    console.warn('Requested status code: ' + statusCode);
  }
  return output;
}
