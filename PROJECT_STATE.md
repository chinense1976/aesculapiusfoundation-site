# Project State: TAF WordPress Migration

> ⚠️ **STALE — superseded by the 2026-07-30 DNS cutover.** This snapshot predates production cutover; it still describes GitHub Pages as production and Phase 6 as in-progress. Do not treat this as current status — check the Notion "TAF WordPress Site — Build & Ops Tracker" and `CLAUDE.md` (canonical repo: `github.com/aesculapius-foundation/taf-wp`) instead.

**Last Updated:** 2026-07-11  
**Entity:** The Aesculapius Foundation (TAF) — 501(c)(3) public charity, EIN 20-0530212  
**Project Status:** Phase 6 (Resource Library) In Progress

---

## Project Goals

Rebuild `aesculapiusfoundation.org` from a static GitHub Pages site into a WordPress CMS-powered site, hosted on GoDaddy Managed WordPress Deluxe, without disrupting the live production site until an explicit DNS cutover.

### Success Criteria
- All 12 core pages migrated to WordPress Gutenberg blocks
- Article/blog CPT fully operational with taxonomy system
- Resource library live with filterable article display
- DNS cutover executed cleanly, GitHub Pages site fully retired
- Editorial independence and transparency maintained across all content
- Site remains nonprofit-focused, educational, non-commercial

---

## Architecture

### Hosting
- **Primary Host:** GoDaddy Managed WordPress Deluxe (North America)
- **Staging URL:** `1217804.us16.myftpupload.com`
- **SSH/SFTP:** `1217804.us16.ssh.myftpupload.com`
- **Database:** phpMyAdmin available
- **Production DNS:** Still points to GitHub Pages (untouched until cutover)
- **Rejected Alternatives:** WP Engine (no nonprofit discount), Azure (reserved for offsite backups only)

### WordPress Configuration
- **Theme:** Active block theme (Gutenberg-native)
- **Core Pages:** 12 pages (Home, Mission, Programs, Validation, Grants, Advisory, Support, Contact, Resources, Partner, Supporters, Editorial Independence)
- **Custom Post Type (Article):** 8 CPTs total with 6 custom taxonomies
- **Taxonomies (Fixed Vocabulary):** Audience, Topic, Program Area, Content Format, Setting, Species Context
- **Content Types:** Custom Post Type UI (free plugin, non-TechSoup)

### Key Technical Constraints
- **Navigation:** Block theme snapshots classic menu into static blocks on first render. Editing classic menu after doesn't update visible nav → must edit `wp_navigation` post (ID 21) directly via REST or Site Editor
- **Yoast Meta Description/Keyphrase:** No REST write route (Yoast v28+) → must be pasted manually in editor
- **Forms:** Google Forms / Google Apps Script for intake (Evaluation Program, Grant Request) — no online payments
- **Donations:** Offline only (checks/wire/ACH) — no GiveWP or payment gateway

### Automation Tools
- **wp_publish.py:** One-command blog publish helper
  - Reads metadata comment block from draft.html (SEO Title, Slug, Meta Description, Focus Keyphrase, Audience, Topic, Program Area, Content Format, Setting, Species Context)
  - Uploads new images, applies alt-text from alt-text.txt
  - Resolves taxonomy terms from fixed vocabulary (errors if term doesn't exist)
  - Creates or updates post, sets featured image
  - Caches post_id and image URLs in post.json for re-runs
  - Flags manual steps: Yoast meta description/keyphrase (must be pasted in editor)

- **wp_upload.py:** Bulk media library uploader
  - Used separately when bulk uploading images before publishing

---

## Completed Work

### Phase 1: Hosting & Dependencies ✓
- GoDaddy Managed WordPress Deluxe account created
- Staging environment configured
- WP Engine application rejected (verified no nonprofit discount exists)

### Phase 2: Staging Setup ✓
- WordPress installed and configured on staging site
- Block theme activated
- Custom Post Type UI plugin installed (free)
- Core Gutenberg blocks prepared

### Phase 3: Site Rebuild (12 Core Pages) ✓
All pages converted from static HTML to Gutenberg block JSON and published:
- Home
- Mission
- Programs
- Diagnostic Evaluation Program (Validation)
- Access, Affordability & Equipment Grant Program (Grants)
- Advisory Board
- Support Our Mission
- Contact
- Resource Library
- Partner With Us
- Supporters & Technology Resources
- Editorial Independence

### Phase 4: CMS Content Model (8 Post Types, 6 Taxonomies) ✓
**Custom Post Types (CPTs):**
- Article (primary blog/resource post type)
- + 7 others reserved for future content types

**Taxonomies (Fixed Vocabulary, non-creatable via API):**
1. **Audience** (23, 25, 26, 27, 28) — Veterinarians, Pet Owners, Producers/Ranchers, Wildlife Professionals, Public Health
2. **Topic** (30, 31, 32) — Disease Preparedness, One Health, Zoonotic Disease
3. **Program Area** (37) — Education
4. **Content Format** (38, 39) — Explainer, Checklist
5. **Setting** (42, 43, 45) — Farm/Field, Clinic, Community
6. **Species Context** (46, 49) — Cattle, Multi-species

**Known Bug (Low Priority, Worked Around):**
- Article byline renders empty in published posts (rendered in post.json via template but not displaying in theme)
- Workaround: Manually add byline text to article body until theme template is reviewed

### Phase 5: Forms & Donations ✓
- **Resolved:** No online donation processor needed — donations handled offline (checks, wire, ACH)
- **Resolved:** Gravity Forms via TechSoup is a dead end — no TechSoup discount available
- **Current State:** Evaluation Program and Grant Request intake remain on Google Forms/Apps Script (interim solution)
- **Future:** If native WordPress form plugin needed later, must be purchased directly or sourced elsewhere

### Phase 6: Resource Library — IN PROGRESS
**Completed:**
- Article CPT live and functional
- Article post type fully configured with all 6 taxonomies
- post.json caching system for image uploads and metadata
- wp_publish.py automation working end-to-end
- Featured image support
- Alt-text infrastructure (alt-text.txt parsing, applied to media library on each run)
- "From the Resource Library" widget built and deployed to all 12 core pages
- Homepage resource display live (currently showing latest articles, no topic filtering yet)
- Related Reading pattern synced across all core pages

**In Progress / Pending:**
- Article drafting and publishing (8 articles planned, 1 published as of 2026-07-10)
  - **Published (Post ID 48):** "New World Screwworm in the U.S.: What to Look For, Who to Call, and Why Early Detection Matters"
  - **Drafted but Not Yet Published:** 7 additional articles
    - Blog-2: Sensitivity and Specificity
    - Blog-3: HPAI One Health
    - Blog-4: Real Cost of Testing
    - Blog-5: Antimicrobial Resistance
    - Blog-6: Community Detection Capacity
    - Blog-7: Workflow Fit
    - Blog-8: One Health on the Farm
- Topic-based filtering for homepage resource display (currently shows all articles chronologically)
- Additional resource topics beyond Education program area (future expansion)

---

## Current State

### Live Infrastructure
- **Staging WordPress Site:** `1217804.us16.myftpupload.com` — fully operational
- **Production Site:** `aesculapiusfoundation.org` — still GitHub Pages, untouched
- **Notion Tracker:** "TAF WordPress CMS Migration Tracker" — **authoritative source of truth** (local files may lag)
- **Git Repo:** `github.com/chinense1976/aesculapiusfoundation-site` — contains old static site, still receiving edits until cutover

### Local Files in This Repo (C:\aesculapius-foundation-site)
- **pages.json:** 12 core pages with Gutenberg block content (inputs used to build WordPress site)
- **page_0.json … page_11.json:** Individual page block definitions (static reference)
- **build_blocks.py:** Original script used to generate Gutenberg JSON from static HTML
- **content/blog-posts/:** Organized blog article directories with draft.html, images, alt-text.txt, and post.json manifests
- **content/:** Copy of old static HTML site (reference during migration, not live content)
- **wp_publish.py, wp_upload.py:** Automation tooling for publishing articles
- **.gitignore:** Excludes .env (credentials)
- **CLAUDE.md:** Project instructions (this file)

**Important:** Local files are **inputs and historical reference only**. The actual live/staging WordPress state lives on GoDaddy. Check the staging site directly or Notion tracker for current truth.

### Blog Article Directories
```
content/blog-posts/
├── blog-1-screwworm/              (post ID 48, PUBLISHED)
│   ├── draft.html                 (current version to publish)
│   ├── post.json                  (metadata cache: post_id, slug, image URLs, term IDs)
│   ├── alt-text.txt               (one line per image: "filename: descriptive alt text")
│   ├── *.png, *.jpg, *.gif        (images, auto-uploaded on first wp_publish.py run)
│   └── *.html                     (working drafts, archived versions)
├── blog-2-sensitivity/            (drafted, not published)
├── blog-3-HPAI/
├── blog-4-real-cost/
├── blog-5-resistance/
├── blog-6-comm-detection/
├── blog-7-workflow-fit/
└── blog-8-...                     (future articles)
```

### Publish Workflow
1. Author writes draft.html with optional metadata comment block at the top
2. Place images in the same folder
3. Create alt-text.txt with one line per image: `filename: alt text`
4. Run: `python wp_publish.py content/blog-posts/blog-X/ [--publish] [--featured-image FILENAME]`
5. Script creates/finds post, uploads images, applies alt-text, updates post content
6. **Manual step:** Open editor, paste Yoast meta description and focus keyphrase (script prints the values)
7. Re-run wp_publish.py with `--publish` flag to publish

---

## Known Issues & Gotchas

### Critical Safety Rule (Production Incident 2026-07-08)
A prior session working in the wrong repo used Chrome browser automation to explore the live GoDaddy account, went through the "Managed WordPress" setup flow, and that flow **repointed aesculapiusfoundation.org DNS to an empty placeholder WordPress install**, taking the live production site offline until manually restored.

**Hard Rules (Non-Negotiable):**
- ❌ Never touch DNS, nameservers, or domain settings for aesculapiusfoundation.org without stating the exact change and getting Michael's explicit approval first
- ❌ Never open GoDaddy dashboard "just to check status" — even status checks can trigger unintended setup flows
- ❌ Never run WordPress setup/launch wizards against the live account
- ❌ Only TAF WordPress/DNS work happens from this repo (C:\aesculapius-foundation-site)
- ✓ DNS cutover (Phase 7) happens as one explicit, named action after full verification, not as a byproduct of other work
- ✓ Capture public DNS state before and after any live domain navigation

### Technical Gotchas
1. **Block Theme Navigation:** Classic menu edits don't update the rendered nav (menu is static-snapshotted at first render) → must edit `wp_navigation` post (ID 21) directly via REST or Site Editor
2. **Yoast Meta Description/Keyphrase:** No REST write route (confirmed Yoast v28+) → must be entered manually in the post editor
3. **Article Byline Bug:** Renders empty in published posts (template issue, low priority, workaround: add byline to article body)
4. **Taxonomy Terms:** Fixed vocabulary, non-creatable via REST API → script errors if a term name doesn't match; lists valid options
5. **Alternative Hosts Closed:** WP Engine (no nonprofit discount), Gravity Forms (no TechSoup discount) — decisions are final

---

## Pending Tasks

### Phase 7: DNS Launch & Redirect Map — NOT STARTED
**Scope:**
- Complete URL redirect mapping (old static site paths → new WordPress paths)
- Verify all old blog URLs have redirects to new article slugs
- Audit all internal links across 12 core pages for broken references
- Test full site on staging with live content
- Create DNS inventory (current A records, target records, change sequence)
- Execute DNS cutover (reroute aesculapiusfoundation.org from GitHub Pages to GoDaddy)
- Verify live site health post-cutover
- Update GitHub repo status (archive or redirect)

**Dependencies:** Phase 6 must be substantially complete (articles published, all pages verified)

**Investigated 2026-07-26 — Staging noindex/no-canonical is working as intended, not a bug:**
A brief requested restoring Yoast's `<meta name="robots">` and `<link rel="canonical">` output on staging, which appeared absent from rendered HTML. Investigation (via wp-admin: Code Snippets, Yoast settings, Reading settings) found:
- Settings → Reading → "Discourage search engines from indexing this site" is checked and **locked** by GoDaddy's platform, with GoDaddy's own note: "This is your staging site and it cannot be indexed by search engines."
- Confirmed live: staging homepage currently outputs `noindex, nofollow`.
- The absent canonical is expected Yoast behavior on a noindexed page (Yoast does not emit canonical for noindexed content).
- No Code Snippets, theme, or mu-plugin code is stripping these tags — the only active snippet just renders featured images above article content.
- **No changes made** to snippets, theme files, mu-plugins, Yoast settings, robots.txt, or caches. Nothing needs fixing here.

**Pre-cutover verification checklist (add to Phase 7 execution, do not skip):**
- [ ] Confirm GoDaddy's staging noindex lock (Settings → Reading) is removed/unlocked once the production domain is pointed at this WordPress install
- [ ] Confirm the homepage (and other core pages) becomes indexable — `<meta name="robots">` should show `index, follow` (or no restrictive directive), not `noindex`
- [ ] Confirm Yoast restores `<link rel="canonical">` output now that pages are indexable
- [ ] Confirm the XML sitemap (`/sitemap_index.xml`) references the **production** domain (`aesculapiusfoundation.org`), not the staging subdomain
- [ ] Confirm `/robots.txt` references the **production** domain and no longer carries the staging `noindex` behavior

### Phase 8: Governance (Donor Language) — NOT STARTED
**Scope:**
- Add/clarify donor recognition pages if needed
- Review and update supporter language for accuracy and compliance
- Ensure all partner/supporter disclosures are up-to-date
- Confirm Candid profile alignment with website content
- Final legal review of all external-facing content

**Dependencies:** No blocking dependencies; can run in parallel with Phase 7

---

## Next Steps (Likely)

1. **Finish drafting remaining 7 articles** (Phase 6 continuation)
   - Complete blog-2 through blog-8 drafts
   - Add all images and alt-text
   - Set metadata blocks with SEO titles, keywords, audience/topic/program area/etc. tags
   - Publish all articles using wp_publish.py --publish

2. **Implement topic-based filtering** on homepage resource display
   - Homepage widget currently shows all articles; should be able to filter by topic/program area
   - This is a Phase 6 enhancement, not blocking cutover

3. **Create URL redirect map** (Phase 7 prep)
   - Document old static site URLs and their new WordPress equivalents
   - Set up redirects in WordPress (plugin or .htaccess)
   - Test all old links

4. **DNS cutover planning** (Phase 7)
   - Audit current A/CNAME records via public DNS lookup (not GoDaddy dashboard)
   - Plan exact records to change
   - Schedule cutover window
   - Get Michael's explicit approval for the specific DNS changes before touching anything

5. **Governance review** (Phase 8)
   - Final check on all donor/supporter language
   - Candid profile sync
   - Legal compliance review

---

## File Index

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project instructions (this file) |
| `PROJECT_STATE.md` | This document — complete project snapshot |
| `README.md` | GitHub Pages deployment guide (old static site docs) |
| `pages.json` | 12 core pages with Gutenberg block JSON (input reference) |
| `page_0.json … page_11.json` | Individual page definitions |
| `build_blocks.py` | Historical: generated Gutenberg JSON from static HTML |
| `wp_publish.py` | Article publish automation (metadata, images, taxonomy, alt-text) |
| `wp_upload.py` | Bulk media uploader |
| `content/blog-posts/blog-*/` | Article directories (draft.html, images, post.json, alt-text.txt) |
| `content/` | Old static HTML site copy (reference only) |
| `.gitignore` | Excludes .env (credentials) |
| `redirects.json` | QR redirect map (see docs/qr-redirects.md) |
| `docs/qr-redirects.md` | Self-hosted QR redirect documentation |

---

## Key Decisions & Closed Discussions

| Topic | Decision | Rationale | Date |
|-------|----------|-----------|------|
| Online Donations | No GiveWP or payment gateway | Donations handled offline (checks, wire, ACH); simplifies compliance and maintenance | 2026-07-08 |
| Gravity Forms | TechSoup grant does not exist for it | Confirmed via TechSoup catalog; current intake forms stay on Google Forms | 2026-07-08 |
| CMS Content Types | Custom Post Type UI (free plugin) | No TechSoup-funded alternative needed; CPTU is free and sufficient | 2026-07-08 |
| Host Selection | GoDaddy Managed WordPress Deluxe | WP Engine rejected (no nonprofit discount); Azure reserved for backups only | 2026-07-01 |
| Article Byline Bug | Documented, workaround: add to body | Low priority; theme template issue; does not block publishing | 2026-07-10 |

---

## Related Resources

- **Notion Tracker (Authoritative):** "TAF WordPress CMS Migration Tracker" (under 🏛️ Aesculapius Foundation HQ)
- **Second-Brain Vault:** `C:\Dev\ClinixLynx-Second-Brain\ACTIVE PROJECTS\The Aesculapius Foundation\`
- **Old Static Site:** `github.com/chinense1976/aesculapiusfoundation-site` (GitHub Pages, still live, local clone at `C:\Users\Michael Touby\GitHub\aesculapiusfoundation-site`)
- **Production Site:** `aesculapiusfoundation.org` (currently GitHub Pages, will be DNS-switched to GoDaddy WordPress during Phase 7)
- **Staging Site:** `1217804.us16.myftpupload.com` (WordPress, test content)

---

## Important Notes

1. **Notion is the source of truth** for phase/task status. Always check the Notion tracker before assuming something is complete or in progress.
2. **Local files in this repo are inputs, not a mirror** of live WordPress state. The actual live/staging site is on GoDaddy.
3. **DNS changes are irreversible** without manual intervention. Every DNS change requires explicit per-action approval.
4. **TAF and ClinixLynx are separate entities.** Do not blend nonprofit (TAF) work with commercial (ClinixLynx) work.
5. **Editorial independence is non-negotiable.** All Foundation programs maintain independence from commercial interests.
