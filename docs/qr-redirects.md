# QR Redirect System

Replaces Flowcode. QR codes point to permanent URLs like `https://www.aesculapiusfoundation.org/qr/conference`. The destination behind that URL can be changed at any time without reprinting the QR code.

## How it works

- GitHub Pages has no server, so there's no per-path redirect config. Instead, `/qr/<slug>` is a path that doesn't exist as a real file, so GitHub Pages serves `404.html` for it (this is standard GitHub Pages behavior for any unmatched path).
- `404.html` has a small inline script (in `<head>`) that runs before the page paints. It checks if the URL matches `/qr/<slug>`. If it does, it fetches `redirects.json`, looks up `<slug>`, and immediately redirects (`location.replace`) to the mapped destination — the visitor never sees the "Page Not Found" content.
- If the slug isn't in `redirects.json`, the script backs out and the normal 404 page displays.
- Destinations automatically get `?utm_source=qr&utm_medium=print&utm_campaign=<slug>` appended (unless the destination already has its own `utm_source`), so QR scans are visible as a traffic source in any analytics already running on the destination page.

Files involved:

- `redirects.json` — the only file you edit day-to-day.
- `404.html` — contains the redirect script. Don't need to touch this to add/change QR codes.

## Adding a new QR code

1. Open `redirects.json`.
2. Add a new key/value pair — key is the slug, value is the full destination URL:

   ```json
   "open-house": "https://www.aesculapiusfoundation.org/contact.html"
   ```

3. Commit and push to `main` (see Deploying changes below).
4. The permanent URL is `https://www.aesculapiusfoundation.org/qr/open-house`.
5. Generate a QR code image pointing at that URL (see below).

No limit on how many slugs you add.

## Editing an existing destination

1. Open `redirects.json`.
2. Change the value for the slug you want to repoint, e.g. change `"conference"` from `wvc.html` to `conference-2027.html`.
3. Commit and push to `main`.
4. Every QR code already printed with `/qr/conference` on it now goes to the new page automatically. Nothing about the printed QR code needs to change.

## Deploying changes

This site deploys via GitHub Pages "Deploy from a branch" — any push to `main` publishes automatically. No build step.

```
git add redirects.json
git commit -m "Update conference QR destination"
git push origin main
```

GitHub Pages deployment usually takes under a minute, but isn't instant — wait ~1 minute, then hard-refresh before verifying.

## Generating a QR code image

The QR code image itself never needs regenerating once created, because it only ever points at the permanent `/qr/<slug>` URL, never at the real destination.

To generate one:

1. Use any QR generator (e.g. [qr-code-generator.com](https://www.qr-code-generator.com), Google "QR code generator", or a design tool like Canva).
2. Encode the permanent URL: `https://www.aesculapiusfoundation.org/qr/<slug>`.
3. Export as SVG or high-res PNG for print.
4. Use that image on printed materials, signage, etc. — it's permanent and doesn't need to be swapped out even if the destination changes later.

## Testing a slug before printing

Visit `https://www.aesculapiusfoundation.org/qr/<slug>` directly in a browser. If the slug exists in `redirects.json`, you'll be redirected immediately. If not, you'll see the normal "Page Not Found" page — check for typos in the slug.

## Analytics

No third-party subscription and no new tracking script added. Each redirect appends `utm_source=qr&utm_medium=print&utm_campaign=<slug>` to the destination URL. If Google Analytics (or any analytics) is ever added to the destination pages, QR scans will show up as their own traffic source/campaign automatically — filter by `utm_campaign` to see performance per QR code.

If per-scan counts are needed before a destination page has its own analytics, the simplest low-maintenance option is a Google Apps Script Web App (same pattern as `apps-script/advisory-board-form.gs`) that logs a row per scan to a Sheet — this wasn't built by default to avoid adding a dependency nobody asked for, but it's a small addition if wanted.
