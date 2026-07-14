# TAF Website (WordPress Rebuild) — Project Instructions

**Entity:** The Aesculapius Foundation (TAF) — 501(c)(3) public charity, EIN 20-0530212
**This folder:** Canonical local home for the WordPress rebuild of aesculapiusfoundation.org
**Not this repo:** ClinixLynx Connect (`C:\clinixlynx-connect`) is a separate commercial codebase for a different entity (CLXX Animal Health LLC). Keep TAF nonprofit work and ClinixLynx commercial work in separate sessions/repos — do not blend them.

---

## Source of Truth — Read This First

Before answering any status question or starting new work, query Notion:

**Database:** "TAF WordPress CMS Migration Tracker" (under 🏛️ Aesculapius Foundation HQ)

This tracker is authoritative for phase/task status. Local files in this folder and notes in the Obsidian second-brain vault (`C:\Dev\ClinixLynx-Second-Brain`) can lag behind it — always confirm against Notion before reporting progress or assuming something is/isn't done. This was gotten wrong once already (2026-07-08) by trusting stale vault notes instead of Notion.

**Mandatory: update the Notion tracker before ending any session that changes WordPress state.** Gap found 2026-07-09 — a full day of WordPress work (content model, first published article, template fixes) left Phase 6 showing a single stale "Not started" row because nothing required writing progress back to Notion. Before ending a session that touches the staging site (new/edited content types, published articles, template changes, plugin changes, bug fixes), either update the relevant existing row's Status/Notes or add a new row under the right Phase describing what changed and its current state. Don't rely on the row already existing — Phase 6 in particular only had one generic planning row with no per-article or per-feature tracking; add rows as needed rather than leaving work untracked.

---

## What This Project Is

Rebuilding aesculapiusfoundation.org from a static GitHub Pages site into a WordPress CMS, on a GoDaddy-hosted staging environment, without disrupting the live static site until cutover.

## INCIDENT — Production Site Taken Down (2026-07-08) — Read Before Touching GoDaddy/DNS

A Claude Code session working in the *wrong* repo (`C:\clinixlynx-connect`) used Chrome browser automation to explore Michael's live GoDaddy account, went through a "Managed WordPress" setup flow, and that flow repointed `aesculapiusfoundation.org` DNS away from GitHub Pages to a new, empty "Coming Soon" placeholder WordPress install (`1215462.us16.myftpupload.com` — not the real staging site `1217804...`). The live production site was down until DNS was manually restored the same day. Michael never approved this and never wants a live site taken down as a side effect of other work.

**Hard rule for this project (also enforced globally, see user CLAUDE.md):**
- Never touch DNS, nameservers, or domain settings for `aesculapiusfoundation.org` — via browser, API, or otherwise — without stating the exact change and getting Michael's explicit go-ahead for that specific change, first.
- Never run GoDaddy's WordPress setup/launch wizards against this account without confirming first whether a staging site already exists (check this file + Notion tracker before creating anything new).
- Cutover from the old static site to the new WordPress build (Phase 7) happens as one explicit, approved action — only after the new site is fully verified ready, redirect map is done, and DNS inventory is complete. It is never a byproduct of exploration.
- TAF WordPress/DNS work only happens from this repo (`C:\aesculapius-foundation-site`). If a session is running elsewhere, stop and flag it before taking any live action.

## Current Hosting (decided 2026-07-01)

- **Host:** GoDaddy Managed WordPress Deluxe
- **Staging site:** `1217804.us16.myftpupload.com`
- **SSH/SFTP:** `1217804.us16.ssh.myftpupload.com`
- phpMyAdmin available; North America data center
- **Production DNS still points to GitHub Pages** — the live site is untouched until an explicit cutover decision
- WP Engine: applied for nonprofit hosting, **rejected** — confirmed no nonprofit discount exists (verified independently against WP Engine's own site and TechSoup's catalog)
- Azure $2,000/yr nonprofit credit: retained for offsite backups only, not the primary host

## Decisions Already Closed — Do Not Revisit

- **No online donation processor.** Donations run offline (checks/other methods). GiveWP and payment gateway work is out of scope.
- **Gravity Forms via TechSoup: dead end**, confirmed 2026-07-08 — no TechSoup grant/discount exists for it. If a forms plugin is needed later, it must be sourced by direct purchase or a different plugin. Current intake forms (Evaluation Program, Grant Request) stay on Google Forms/Apps Script in the interim.
- **CMS content types built with Custom Post Type UI** (free WordPress.org plugin) — no paid/TechSoup plugin license needed for this.

## Build Status Snapshot (as of 2026-07-09 — verify against Notion before trusting this)

| Phase | Status |
|---|---|
| 1 — Hosting & dependencies | Done |
| 2 — Staging setup | Done |
| 3 — Site rebuild (12 pages) | Done |
| 4 — CMS content model (8 post types, 6 taxonomies) | Done (1 open low-priority bug: article byline renders empty, worked around) |
| 5 — Forms & donations | Resolved (no online payment needed) |
| 6 — Resource library | In progress — article CPT live; Screwworm article (post 48) drafted but still unpublished/untagged; homepage "From the Resource Library" widget + synced "Related Reading" pattern built and live on all 12 core pages, currently showing latest articles (no topic filtering yet) |
| 7 — DNS launch / redirect map | Not started |
| 8 — Governance (donor language) | Not started |

## Known Gotcha

The active block theme **snapshots the classic menu into static blocks on first render**. Editing the classic menu afterward does NOT update the visible nav. To change navigation, edit the `wp_navigation` post (ID 21) directly via REST, or use the Site Editor.

## Local Files in This Folder

- `content/` — copy of the **old static HTML site** (GitHub Pages version), kept for reference during migration. Not the live WordPress content.
- `build_blocks.py`, `pages.json`, `page_0.json`…`page_11.json` — Gutenberg block-JSON conversions generated from the static HTML, used to push page content to WordPress via REST.
- The actual live/staging WordPress state lives on GoDaddy, not in this folder — these files are inputs to that process, not a mirror of it. Check the staging site directly (or Notion) for current live state.

## Related Locations

- Old static site (still live in production): `github.com/chinense1976/aesculapiusfoundation-site`, local clone at `C:\Users\Michael Touby\GitHub\aesculapiusfoundation-site` — still receiving active edits until cutover; don't let it silently drift out of sync with the WordPress rebuild's page content.
- Second-brain vault (planning/history, not live status): `C:\Dev\ClinixLynx-Second-Brain\ACTIVE PROJECTS\The Aesculapius Foundation\`
- CMS architecture recommendation (2026-06-02, historical — superseded in parts by the hosting pivot above): `C:\ClaudeWork\TAF Site Build\`

## Working Rules

- Keep TAF messaging nonprofit, educational, independent, donor-ready, non-commercial. No ClinixLynx sales language.
- Preserve nonprofit/commercial entity separation at all times.
- Do not treat this folder's local files as the source of truth for what's live — the GoDaddy staging site and the Notion tracker are authoritative; this folder holds inputs and history.

## Standing Rule — Real Photos Only (No AI-Generated Images)

Every photo used on the live site (and the WordPress rebuild) must be a real photograph — sourced from a free-license library (Pexels, Unsplash, CDC/USDA public domain, etc.) or an actual TAF program photo. Verify authenticity before using an image: real photos carry camera EXIF (resolution/copyright/software tags); AI-generated images typically have none. Do not use images with watermarks removed — that's a copyright risk, not a valid free-use source, regardless of what any prior README/batch claims.

**Exception:** AI is fine for generated graphics that are clearly diagrams — charts, graphs, infographics. Not photos of people, animals, places, or events.

**Why:** 2026-07-13 — the live site had multiple AI-generated stock-style photos in place of real ones (program cards, 404 page); replaced with verified real Pexels photos. Michael's stated reason: doesn't want the foundation's own site to look "fake" or read as AI-generated to visitors or to Google.

A batch of ~45 AI-sourced/questionable-provenance images plus 2 README files documenting them exist unused in `assets/images/` (numbered `01_...jpg`–`46_...jpg`, plus 2 UUID-named PNGs) — left in place by Michael's choice, not deleted. Do not use these for any live page.
