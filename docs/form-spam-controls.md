# Form spam controls

Implemented for the Advisory Board application form on the public foundation site.

## Current controls

- Hidden honeypot field: `company_website_confirm`
- Submit timing check: blocks submissions completed in under 4 seconds
- Required dropdown selections for `expertise` and `availability`
- Minimum and maximum text lengths on required narrative fields
- Random-string screening for name, title, and organization fields
- Suspicious domain screening for known spammy domains and TLDs
- Browser-local rate limiting: maximum two advisory submissions per hour per browser

## Known spam indicators observed

- Random applicant names such as `wrgseyipqr` and `dyxtnipmqm`
- Disposable-looking `.info` email domain: `immenseignite.info`
- Placeholder dropdown values such as `Select one`
- Test-looking external URLs ending in `/test`
- Multiple near-duplicate submissions within one minute

## Recommended server-side Google Apps Script controls

Client-side controls reduce noise but can be bypassed. The Google Apps Script endpoint should also reject or quarantine suspicious submissions before creating rows or sending email notifications.

Recommended checks:

1. Reject if `company_website_confirm` is non-empty.
2. Reject if `expertise` or `availability` is blank or still equals `Select one`.
3. Reject if required narrative fields are under 40 characters.
4. Quarantine or reject domains including `immenseignite.info` and high-risk TLDs such as `.xyz`, `.top`, `.click`, `.rest`, `.cam`, `.quest`, and `.info`.
5. Add IP/rate limiting if the deployment method exposes client IP or proxy metadata.
6. Add a `SpamStatus` or `ReviewStatus` column to the Google Sheet so suspicious submissions can be logged without triggering notification emails.

## Optional next layer

Add Cloudflare Turnstile to the public form and verify Turnstile tokens server-side in Google Apps Script or via a lightweight serverless endpoint. Do not rely on a front-end-only Turnstile widget without server-side verification.
