#!/usr/bin/env python3
"""Keep the site index and the README in sync with the files in this repository.

Run it by hand:

    python3 tools/sync_site.py

...or let .github/workflows/sync-site.yml run it on every push to `main`.

It scans every folder for HTML pages and images, records anything new in
`pages.json` (with a sensible default title/description), then regenerates
the blocks between the `<!-- AUTO:...:START -->` / `<!-- AUTO:...:END -->`
markers in `index.html` and `README.md`.

Curated text lives in `pages.json` - edit titles, descriptions, tags and
captions there; this script never overwrites a value that already exists.
"""

from __future__ import annotations

import html
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"
README = ROOT / "README.md"
META = ROOT / "pages.json"

SKIP_DIRS = {".git", ".github", "tools", "node_modules", "__pycache__", ".venv", "venv"}
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"}
SITE_TITLE = "S79146 Web Design Lab Portfolio"


# --------------------------------------------------------------------------- #
# Discovery
# --------------------------------------------------------------------------- #
def discover() -> tuple[list[Path], list[Path], list[Path]]:
    """Return (html pages, images, every tracked file) as repo-relative paths."""
    pages: list[Path] = []
    images: list[Path] = []
    files: list[Path] = []

    for dirpath, dirnames, filenames in os.walk(ROOT):
        rel_dir = Path(dirpath).relative_to(ROOT)
        dirnames[:] = sorted(
            d for d in dirnames if d not in SKIP_DIRS and not d.startswith(".")
        )
        if ".github" in rel_dir.parts or rel_dir.parts[:1] == ("tools",):
            pass  # already filtered above, kept for clarity

        for name in sorted(filenames):
            path = Path(rel_dir, name)
            files.append(path)
            if name.startswith("."):
                continue
            suffix = path.suffix.lower()
            if suffix == ".html" and path.as_posix() != "index.html":
                pages.append(path)
            elif suffix in IMAGE_EXTS:
                images.append(path)

    # .github and tools are skipped by the walk, add their files back for the tree
    for extra in sorted((ROOT / ".github").rglob("*")):
        if extra.is_file():
            files.append(extra.relative_to(ROOT))
    for extra in sorted((ROOT / "tools").rglob("*")):
        if extra.is_file() and "__pycache__" not in extra.parts:
            files.append(extra.relative_to(ROOT))

    pages.sort(key=lambda p: p.as_posix().lower())
    images.sort(key=lambda p: (image_order(p), p.as_posix().lower()))
    files.sort(key=lambda p: p.as_posix().lower())
    return pages, images, files


def natural_key(name: str) -> list:
    """Sort "Lab 2" before "Lab 10" and keep "(root)" last."""
    if name == "(root)":
        return [chr(0x10FFFF)]
    return [int(part) if part.isdigit() else part.lower()
            for part in re.split(r"(\d+)", name)]


def page_order(path: Path) -> tuple[int, str]:
    """Order within a folder: lab1.html, then the exercises, then the rest."""
    stem = path.stem.lower()
    if re.fullmatch(r"lab\d+", stem):
        return (0, stem)
    match = re.match(r"lab\d+_exer([a-z])", stem)
    if match:
        return (1, match.group(1))
    return (2, stem)


def image_order(path: Path) -> tuple[list, int, str]:
    """Group by folder, validation screenshots first, then other images."""
    is_other = 1 if "validation" not in path.stem.lower() else 0
    return (natural_key(section_key(path)), is_other, path.stem.lower())


def section_key(path: Path) -> str:
    """Folder a page belongs to; root-level pages use '(root)'."""
    return path.parent.as_posix() if path.parent.as_posix() != "." else "(root)"


# --------------------------------------------------------------------------- #
# Defaults scraped from the HTML itself
# --------------------------------------------------------------------------- #
def text_of(fragment: str) -> str:
    fragment = re.sub(r"<[^>]+>", " ", fragment)
    return " ".join(html.unescape(fragment).split())


def scrape(path: Path) -> dict[str, str]:
    source = path.read_text(encoding="utf-8", errors="replace")

    title = ""
    match = re.search(r"<title[^>]*>(.*?)</title>", source, re.S | re.I)
    if match:
        title = text_of(match.group(1))
    if not title:
        match = re.search(r"<h1[^>]*>(.*?)</h1>", source, re.S | re.I)
        title = text_of(match.group(1)) if match else ""
    if not title:
        title = path.stem.replace("_", " ").replace("-", " ").strip().title()

    description = ""
    match = re.search(
        r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']',
        source,
        re.S | re.I,
    )
    if match:
        description = text_of(match.group(1))
    if not description:
        match = re.search(r"<p[^>]*>(.*?)</p>", source, re.S | re.I)
        description = text_of(match.group(1)) if match else ""
    if len(description) > 130:
        description = description[:130].rsplit(" ", 1)[0] + "…"
    if not description:
        description = f"HTML page in {section_key(path)}."

    return {"tag": guess_tag(path), "title": title, "description": description}


def guess_tag(path: Path) -> str:
    match = re.search(r"_exer([a-z])", path.stem, re.I)
    if match:
        return f"Exercise {match.group(1).upper()}"
    if re.match(r"lab\d", path.stem, re.I):
        return "Lab page"
    return "Page"


def pretty_folder(key: str) -> str:
    if key == "(root)":
        return "Site pages"
    return key.replace("_", " ")


# --------------------------------------------------------------------------- #
# pages.json maintenance
# --------------------------------------------------------------------------- #
def load_meta() -> dict:
    if META.exists():
        return json.loads(META.read_text(encoding="utf-8"))
    return {}


def sync_meta(meta: dict, pages: list[Path], images: list[Path]) -> dict:
    meta.setdefault("sections", {})
    meta.setdefault("pages", {})
    meta.setdefault("images", {})

    for page in pages:
        key = page.as_posix()
        if key not in meta["pages"]:
            meta["pages"][key] = scrape(page)
            print(f"  + added {key}")
        section = section_key(page)
        meta["sections"].setdefault(
            section,
            {
                "title": pretty_folder(section),
                "description": f"Pages in the {pretty_folder(section)} folder.",
            },
        )

    for image in images:
        key = image.as_posix()
        caption = re.sub(r"[_-]+", " ", image.stem)
        caption = re.sub(r"\bvalidation\b", "", caption, flags=re.I)
        caption = " ".join(caption.split()).title() or image.stem
        prefix = "" if section_key(image) == "(root)" else f"{pretty_folder(section_key(image))} · "
        meta["images"].setdefault(key, prefix + caption)

    return meta


# --------------------------------------------------------------------------- #
# Rendering helpers
# --------------------------------------------------------------------------- #
def encode_url(path: str) -> str:
    return path.replace(" ", "%20")


def rich(text: str, *, html_out: bool) -> str:
    """Render `backticked` words as <code>/`code` and escape everything else."""
    parts = text.split("`")
    out = []
    for i, part in enumerate(parts):
        if i % 2:
            out.append(f"<code>{html.escape(part)}</code>" if html_out else f"`{part}`")
        else:
            out.append(html.escape(part) if html_out else part)
    return "".join(out)


def sections_in_order(meta: dict, pages: list[Path]) -> list[str]:
    """Section keys present on disk, ordered naturally (Lab 1, Lab 2, Lab 10...)."""
    keys = {section_key(p) for p in pages}
    return sorted(keys, key=natural_key)


# --------------------------------------------------------------------------- #
# index.html
# --------------------------------------------------------------------------- #
def render_sections(meta: dict, pages: list[Path], images: list[Path]) -> str:
    out: list[str] = []

    for key in sections_in_order(meta, pages):
        section = meta["sections"][key]
        folder_label = "" if key == "(root)" else f"{key}/"
        out += [
            '        <section class="lab">',
            '            <div class="lab-head">',
            f'                <h2>{html.escape(section["title"])}</h2>',
            f'                <span class="folder">{html.escape(folder_label)}</span>',
            "            </div>",
            '            <p class="desc">',
            f"                {rich(section['description'], html_out=True)}",
            "            </p>",
            "",
            '            <div class="grid">',
        ]
        for page in sorted((p for p in pages if section_key(p) == key), key=page_order):
            info = meta["pages"][page.as_posix()]
            out += [
                f'                <a class="card" href="{encode_url(page.as_posix())}">',
                f'                    <span class="tag">{html.escape(info["tag"])}</span>',
                f'                    <h3>{rich(info["title"], html_out=True)}</h3>',
                f'                    <p>{rich(info["description"], html_out=True)}</p>',
                f'                    <span class="file">{html.escape(page.as_posix())}</span>',
                "                </a>",
                "",
            ]
        out += ["            </div>", "        </section>", ""]

    if images:
        gallery = meta.get(
            "gallery",
            {"title": "Screenshots", "description": "Images included in this repository."},
        )
        out += [
            '        <section class="lab">',
            '            <div class="lab-head">',
            f'                <h2>{html.escape(gallery["title"])}</h2>',
            '                <span class="folder">screenshots</span>',
            "            </div>",
            '            <p class="desc">',
            f"                {rich(gallery['description'], html_out=True)}",
            "            </p>",
            "",
            '            <div class="shots">',
        ]
        for image in sorted(images, key=image_order):
            key = image.as_posix()
            caption = meta["images"][key]
            out += [
                '                <figure class="shot">',
                f'                    <a href="{encode_url(key)}">',
                f'                        <img src="{encode_url(key)}" alt="{html.escape(caption)}" loading="lazy">',
                "                    </a>",
                f"                    <figcaption>{html.escape(caption)}</figcaption>",
                "                </figure>",
                "",
            ]
        out += ["            </div>", "        </section>"]

    return "\n".join(out)


def render_stats(meta: dict, pages: list[Path]) -> str:
    sections = len(sections_in_order(meta, pages))
    total = len(pages) + 1  # + index.html
    labs = f"{sections} lab" + ("" if sections == 1 else "s")
    files = f"{total} HTML page" + ("" if total == 1 else "s")
    return (
        f'                <span class="pill">{labs}</span>\n'
        f'                <span class="pill">{files}</span>'
    )


# --------------------------------------------------------------------------- #
# README.md
# --------------------------------------------------------------------------- #
def render_page_table(meta: dict, pages: list[Path]) -> str:
    rows = [
        "| Page | File | What it demonstrates |",
        "| --- | --- | --- |",
    ]
    for key in sections_in_order(meta, pages):
        for page in sorted((p for p in pages if section_key(p) == key), key=page_order):
            info = meta["pages"][page.as_posix()]
            path = page.as_posix()
            rows.append(
                f'| {rich(info["title"], html_out=False)} '
                f"| [`{path}`]({encode_url(path)}) "
                f'| {rich(info["description"], html_out=False)} |'
            )
    return "\n".join(rows)


def render_tree(files: list[Path]) -> str:
    tree: dict = {}
    for path in files:
        node = tree
        for part in path.parts[:-1]:
            node = node.setdefault(part, {})
        node.setdefault("__files__", []).append(path.parts[-1])

    def order(entry: tuple[str, object]) -> tuple[int, int, str]:
        name, child = entry
        is_dir = isinstance(child, dict)
        return (1 if is_dir else 0, 1 if name.startswith(".") else 0, name.lower())

    lines = ["```text", f"{ROOT.name}/"]

    def walk(node: dict, prefix: str) -> None:
        names = list(node.get("__files__", []))
        children = {k: v for k, v in node.items() if k != "__files__"}
        entries: list[tuple[str, object]] = [(n, None) for n in names] + list(children.items())
        entries.sort(key=order)
        for index, (name, child) in enumerate(entries):
            last = index == len(entries) - 1
            label = f"{name}/" if isinstance(child, dict) else name
            lines.append(f"{prefix}{'└── ' if last else '├── '}{label}")
            if isinstance(child, dict):
                walk(child, prefix + ("    " if last else "│   "))

    walk(tree, "")
    lines.append("```")
    return "\n".join(lines)


# --------------------------------------------------------------------------- #
# Markers
# --------------------------------------------------------------------------- #
def replace_block(text: str, name: str, body: str, source: str) -> str:
    pattern = re.compile(
        rf"(<!-- AUTO:{name}:START[^>]*-->)[ \t]*\n(.*?)(<!-- AUTO:{name}:END -->)",
        re.S,
    )
    match = pattern.search(text)
    if not match:
        sys.exit(f"error: {name} markers not found in {source}")
    return text[: match.start()] + f"{match.group(1)}\n{body}\n{match.group(3)}" + text[match.end():]


def main() -> int:
    pages, images, files = discover()
    meta = sync_meta(load_meta(), pages, images)

    META.write_text(json.dumps(meta, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    index_html = INDEX.read_text(encoding="utf-8")
    index_html = replace_block(index_html, "STATS", render_stats(meta, pages), "index.html")
    index_html = replace_block(
        index_html, "SECTIONS", render_sections(meta, pages, images), "index.html"
    )
    INDEX.write_text(index_html, encoding="utf-8")

    readme = README.read_text(encoding="utf-8")
    readme = replace_block(readme, "PAGE_TABLE", render_page_table(meta, pages), "README.md")
    readme = replace_block(readme, "REPO_TREE", render_tree(files), "README.md")
    README.write_text(readme, encoding="utf-8")

    print(f"synced {len(pages)} pages, {len(images)} images")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
