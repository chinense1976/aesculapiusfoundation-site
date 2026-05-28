# The Aesculapius Foundation Website

Static HTML/CSS website for The Aesculapius Foundation.

## Files

- `index.html` — Home page
- `mission.html` — Mission page
- `programs.html` — Programs page
- `validation.html` — Diagnostic Validation Program page and intake form
- `support.html` — Support page
- `contact.html` — Contact page
- `404.html` — fallback page
- `assets/css/styles.css` — global styling
- `assets/images/` — logo, favicon, and site images
- `CNAME` — custom domain target for GitHub Pages

## GitHub Pages deployment

1. Create a new public GitHub repository, for example: `aesculapiusfoundation-site`.
2. Upload all files in this folder to the repository root.
3. In GitHub: Settings → Pages.
4. Set Source to `Deploy from a branch`.
5. Select branch `main` and folder `/root`.
6. Save.
7. In Pages → Custom domain, use: `www.aesculapiusfoundation.org`.
8. In GoDaddy DNS, add the website CNAME for `www` as instructed by GitHub.
9. Do not change Microsoft 365 email DNS records: MX, SPF, DKIM, DMARC, or Autodiscover.

## Contact email

Public website email is currently set to: `contact@aesculapiusfoundation.org`.
