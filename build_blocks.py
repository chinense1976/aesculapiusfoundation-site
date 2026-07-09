import json, re
from bs4 import BeautifulSoup
from pathlib import Path

SRC = Path(r"C:\aesculapius-foundation-site\content")
OUT = Path(r"C:\aesculapius-foundation-site\pages.json")

def esc(s):
    return s

def heading_block(tag, text, level=2):
    return f'<!-- wp:heading {{"level":{level}}} -->\n<h{level} class="wp-block-heading">{text}</h{level}>\n<!-- /wp:heading -->'

def para_block(html_inner):
    return f'<!-- wp:paragraph -->\n<p>{html_inner}</p>\n<!-- /wp:paragraph -->'

def list_block(items):
    lis = "".join(f"<li>{i}</li>" for i in items)
    return f'<!-- wp:list -->\n<ul class="wp-block-list">{lis}</ul>\n<!-- /wp:list -->'

def separator_block():
    return '<!-- wp:separator -->\n<hr class="wp-block-separator has-alpha-channel-opacity"/>\n<!-- /wp:separator -->'

def buttons_block(links):
    # links: list of (text, href, style) style: 'fill'|'outline'
    btns = []
    for text, href, style in links:
        cls = "is-style-fill" if style == "fill" else "is-style-outline"
        btns.append(f'<!-- wp:button {{"className":"{cls}"}} -->\n<div class="wp-block-button {cls}"><a class="wp-block-button__link wp-element-button" href="{href}">{text}</a></div>\n<!-- /wp:button -->')
    inner = "\n".join(btns)
    return f'<!-- wp:buttons -->\n<div class="wp-block-buttons">{inner}</div>\n<!-- /wp:buttons -->'

LINK_MAP = {
    "index.html": "/",
    "mission.html": "/mission/",
    "programs.html": "/programs/",
    "validation.html": "/validation/",
    "grants.html": "/grants/",
    "advisory.html": "/advisory/",
    "support.html": "/support/",
    "contact.html": "/contact/",
    "resources.html": "/resources/",
    "partner.html": "/partner/",
    "supporters.html": "/supporters/",
    "editorial-independence.html": "/editorial-independence/",
}

def rewrite_links(el):
    for a in el.find_all("a"):
        href = a.get("href", "")
        if "#" in href:
            base, _, frag = href.partition("#")
            if base in LINK_MAP:
                a["href"] = LINK_MAP[base].rstrip("/") + "/#" + frag if LINK_MAP[base] != "/" else "/#" + frag
        elif href in LINK_MAP:
            a["href"] = LINK_MAP[href]
    return el

def inner_html(el):
    rewrite_links(el)
    return "".join(str(c) for c in el.contents).strip()

def process_container(container, blocks, heading_level_map=None):
    """Walk a container's descendant elements in document order, emitting blocks."""
    for child in container.find_all(recursive=False):
        process_node(child, blocks)

def process_node(node, blocks, top_level_h2_used=[False]):
    name = node.name
    if name is None:
        return
    if name in ("h1",):
        blocks.append(heading_block(name, node.get_text(strip=True), level=2))
    elif name in ("h2",):
        blocks.append(heading_block(name, node.get_text(strip=True), level=2))
    elif name == "h3":
        blocks.append(heading_block(name, node.get_text(strip=True), level=3))
    elif name == "p":
        cls = node.get("class") or []
        if "small" in cls or "form-note" in cls:
            blocks.append(f'<!-- wp:paragraph {{"fontSize":"small"}} -->\n<p class="has-small-font-size">{inner_html(node)}</p>\n<!-- /wp:paragraph -->')
        else:
            blocks.append(para_block(inner_html(node)))
    elif name == "ul":
        cls = node.get("class") or []
        items = [inner_html(li) for li in node.find_all("li", recursive=False)]
        if items:
            blocks.append(list_block(items))
    elif name == "div":
        cls = node.get("class") or []
        if "actions" in cls:
            links = []
            for a in node.find_all("a", recursive=False):
                text = a.get_text(strip=True)
                href = a.get("href", "#")
                if "#" in href:
                    base, _, frag = href.partition("#")
                    if base in LINK_MAP:
                        href = (LINK_MAP[base].rstrip("/") if LINK_MAP[base] != "/" else "") + "/#" + frag
                elif href in LINK_MAP:
                    href = LINK_MAP[href]
                is_primary = "primary" in (a.get("class") or [])
                links.append((text, href, "fill" if is_primary else "outline"))
            if links:
                blocks.append(buttons_block(links))
        elif "rule" in cls:
            pass  # visual divider handled by theme; skip
        elif node.find("form"):
            # Skip embedded custom forms (e.g. advisory application) here; handled specially by caller
            pass
        elif "form-card" in cls:
            # form-card with no actual <form> tag is just a CTA card (validation/grants Google Form links) - recurse
            process_container(node, blocks)
        else:
            # generic container (container, narrow, two-col, panel, principles, principle, kicker, cta) - recurse
            process_container(node, blocks)
    elif name == "article":
        process_container(node, blocks)

def build_page_blocks(filename, skip_form_note=None):
    html = (SRC / filename).read_text(encoding="utf-8")
    soup = BeautifulSoup(html, "html.parser")
    main = soup.find("main")
    blocks = []
    # page-hero section: h1 + p (lede) -> use as intro paragraph (title itself is WP post title)
    hero = main.find("section", class_="page-hero")
    if hero:
        p = hero.find("p")
        if p:
            blocks.append(f'<!-- wp:paragraph {{"fontSize":"large"}} -->\n<p class="has-large-font-size">{inner_html(p)}</p>\n<!-- /wp:paragraph -->')
        blocks.append(separator_block())
    # remaining sections in order
    sections = main.find_all("section", recursive=False)
    for sec in sections:
        if sec is hero:
            continue
        process_container(sec, blocks)
        blocks.append(separator_block())
    # drop trailing separator
    while blocks and blocks[-1] == separator_block():
        blocks.pop()
    if skip_form_note:
        blocks.append(para_block(skip_form_note))
    return "\n\n".join(blocks)

def build_home_blocks():
    html = (SRC / "index.html").read_text(encoding="utf-8")
    soup = BeautifulSoup(html, "html.parser")
    main = soup.find("main")
    blocks = []
    hero = main.find("section", class_="hero")
    if hero:
        h1 = hero.find("h1")
        tagline = hero.find("p", class_="tagline")
        lede = hero.find("p", class_="lede")
        if h1:
            blocks.append(heading_block("h1", h1.get_text(strip=True), level=1))
        if tagline:
            blocks.append(f'<!-- wp:paragraph {{"fontSize":"large"}} -->\n<p class="has-large-font-size"><em>{inner_html(tagline)}</em></p>\n<!-- /wp:paragraph -->')
        if lede:
            blocks.append(para_block(inner_html(lede)))
        actions = hero.find("div", class_="hero-actions")
        if actions:
            links = []
            for a in actions.find_all("a"):
                text = a.get_text(strip=True)
                href = a.get("href", "#")
                href = LINK_MAP.get(href, href)
                is_primary = "primary" in (a.get("class") or [])
                links.append((text, href, "fill" if is_primary else "outline"))
            blocks.append(buttons_block(links))
        blocks.append(separator_block())
    for sec in main.find_all("section", recursive=False):
        if sec is hero:
            continue
        process_container(sec, blocks)
        blocks.append(separator_block())
    while blocks and blocks[-1] == separator_block():
        blocks.pop()
    return "\n\n".join(blocks)

pages = []

pages.append({
    "slug": "home",
    "title": "Home",
    "content": build_home_blocks(),
})
pages.append({
    "slug": "mission",
    "title": "Mission",
    "content": build_page_blocks("mission.html"),
})
pages.append({
    "slug": "programs",
    "title": "Programs",
    "content": build_page_blocks("programs.html"),
})
pages.append({
    "slug": "validation",
    "title": "Diagnostic Evaluation Program",
    "content": build_page_blocks("validation.html"),
})
pages.append({
    "slug": "grants",
    "title": "Access, Affordability & Equipment Grant Program",
    "content": build_page_blocks("grants.html"),
})
pages.append({
    "slug": "advisory",
    "title": "Advisory Board",
    "content": build_page_blocks(
        "advisory.html",
        skip_form_note='<strong>Apply:</strong> The advisory board application form is being rebuilt as a native WordPress form (Phase 5 — forms &amp; donations). In the meantime, email <a href="mailto:SoniaTouby@aesculapiusfoundation.org">SoniaTouby@aesculapiusfoundation.org</a> with your background, area of expertise, and interest in serving.'
    ),
})
pages.append({
    "slug": "support",
    "title": "Support Our Mission",
    "content": build_page_blocks("support.html"),
})
pages.append({
    "slug": "contact",
    "title": "Contact",
    "content": build_page_blocks("contact.html"),
})
pages.append({
    "slug": "resources",
    "title": "Resource Library",
    "content": build_page_blocks("resources.html"),
})
pages.append({
    "slug": "partner",
    "title": "Partner With Us",
    "content": build_page_blocks("partner.html"),
})
pages.append({
    "slug": "supporters",
    "title": "Supporters & Technology Resources",
    "content": build_page_blocks("supporters.html"),
})
pages.append({
    "slug": "editorial-independence",
    "title": "Editorial Independence",
    "content": build_page_blocks("editorial-independence.html"),
})

OUT.write_text(json.dumps(pages, indent=2), encoding="utf-8")
print("Wrote", OUT, "-", len(pages), "pages")
for p in pages:
    print(p["slug"], len(p["content"]), "chars")
