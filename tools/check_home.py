#!/usr/bin/env python3
"""Corporate home gate for the site root (index.html + assets/home/home.css).

Fails on:
  DASH        em/en/figure dashes, minus signs or spaced hyphens in visible text
  ON-THE-BOX  the phrase "on the box" anywhere in visible text
  DIGIT       any digit in visible text (no prices, numbers or statistics)
  HEX         a CSS/SVG hex color outside the neutral set and the corporate red
  LINK        a local href/src/srcset/url() that does not resolve, or a #fragment with no matching id
  BROWSER     console errors, failed requests, or horizontal scroll at phone width (headless Chromium)

Visible text = HTML text nodes, <title>, alt/title/aria-label/placeholder attributes and the meta
description. Local paths resolve through _redirects the way Cloudflare Pages does (200 rewrites).
External links are listed, not fetched.

Usage: python3 tools/check_home.py [--shots DIR]   (exit 1 on any finding)
  --shots DIR  also save full-page screenshots home-1440.png and home-390.png into DIR
"""
from __future__ import annotations

import argparse
import functools
import http.server
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import threading
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent
HTML = ROOT / "index.html"
CSS = ROOT / "assets" / "home" / "home.css"

NEUTRAL = {"FFFFFF", "F5F5F7", "E6E7E9", "86868B", "6E6E73", "1D1D1F", "1C1D20", "000000"}
RED = {"EE243B"}
ALLOWED = NEUTRAL | RED

HEX_RE = re.compile(r"#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b")
DASH_RE = re.compile(r"[‒–—―−]|\s-\s|^-\s|\s-$")
BOX_RE = re.compile(r"on\s+the\s+box", re.I)
DIGIT_RE = re.compile(r"\d")
VISIBLE_ATTRS = {"alt", "title", "aria-label", "placeholder"}
COLOR_ATTRS = {"fill", "stroke", "stop-color", "flood-color", "color", "style"}
LINK_ATTRS = {"href", "src"}


class Page(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.texts: list[tuple[int, str]] = []
        self.styles: list[tuple[int, str]] = []
        self.colors: list[tuple[int, str]] = []
        self.links: list[tuple[int, str]] = []
        self.ids: set[str] = set()
        self._in: str | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        line = self.getpos()[0]
        a = {k: v or "" for k, v in attrs}
        if a.get("id"):
            self.ids.add(a["id"])
        for k in VISIBLE_ATTRS:
            if a.get(k):
                self.texts.append((line, a[k]))
        if tag == "meta" and a.get("name") == "description":
            self.texts.append((line, a.get("content", "")))
        if tag == "meta" and a.get("name") == "theme-color":
            self.colors.append((line, a.get("content", "")))
        for k in COLOR_ATTRS:
            if a.get(k):
                self.colors.append((line, a[k]))
        for k in LINK_ATTRS:
            if a.get(k):
                self.links.append((line, a[k]))
        for k in ("srcset", "imagesrcset"):
            for part in a.get(k, "").split(","):
                if part.strip():
                    self.links.append((line, part.split()[0]))
        if tag in ("script", "style"):
            self._in = tag

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)
        if tag in ("script", "style"):
            self._in = None

    def handle_endtag(self, tag: str) -> None:
        if tag in ("script", "style"):
            self._in = None

    def handle_data(self, data: str) -> None:
        line = self.getpos()[0]
        if self._in == "style":
            self.styles.append((line, data))
        elif self._in is None and data.strip():
            self.texts.append((line, data))


def load_redirects() -> list[tuple[str, str, int]]:
    rules = []
    path = ROOT / "_redirects"
    if path.exists():
        for raw in path.read_text().splitlines():
            parts = raw.split()
            if len(parts) >= 2 and not raw.lstrip().startswith("#"):
                rules.append((parts[0], parts[1], int(parts[2]) if len(parts) > 2 else 301))
    return rules


REDIRECTS = load_redirects()


def resolve_url_path(url_path: str, depth: int = 0) -> Path | None:
    """Map a site-absolute URL path to a file the way Cloudflare Pages would serve it."""
    if depth > 5:
        return None
    for src, dst, _code in REDIRECTS:
        if src.endswith("/*") and url_path.startswith(src[:-1]):
            return resolve_url_path(dst.replace(":splat", url_path[len(src) - 1:]), depth + 1)
        if url_path == src:
            return resolve_url_path(dst, depth + 1)
    f = ROOT / unquote(url_path.lstrip("/"))
    if f.is_dir():
        f = f / "index.html"
    return f if f.is_file() else None


def check_text(where: str, text: str, out: list[str]) -> None:
    for line in text.splitlines() or [text]:
        s = line.strip()
        if DASH_RE.search(s):
            out.append(f"DASH       {where}: {s[:110]}")
        if BOX_RE.search(s):
            out.append(f"ON-THE-BOX {where}: {s[:110]}")
        if DIGIT_RE.search(s):
            out.append(f"DIGIT      {where}: {s[:110]}")


def check_hex(where: str, text: str, out: list[str]) -> None:
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    for m in HEX_RE.finditer(text):
        h = m.group(1).upper()
        if len(h) in (3, 4):
            h = "".join(c * 2 for c in h[:3])
        if h[:6] not in ALLOWED:
            out.append(f"HEX        {where}: #{m.group(1)} is not neutral or the corporate red")


def check_link(where: str, base: Path, ref: str, ids: set[str], out: list[str], external: list[str]) -> None:
    u = urlsplit(ref)
    if u.scheme in ("http", "https"):
        external.append(ref)
        return
    if u.scheme in ("mailto", "tel", "data"):
        return
    if not u.path:
        if u.fragment and base == HTML and u.fragment not in ids:
            out.append(f"LINK       {where}: #{u.fragment} has no matching id")
        return
    if u.path.startswith("/"):
        target = resolve_url_path(u.path)
    else:
        f = (base.parent / unquote(u.path)).resolve()
        target = (f / "index.html" if f.is_dir() else f)
        target = target if target.is_file() else None
    if target is None:
        out.append(f"LINK       {where}: {ref} does not resolve")


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a: object) -> None:  # quiet
        pass

    def send_head(self):  # type: ignore[override]
        path = urlsplit(self.path).path
        for src, dst, code in REDIRECTS:
            if code in (301, 302) and path == src:
                self.send_response(code)
                self.send_header("Location", dst)
                self.end_headers()
                return None
        f = resolve_url_path(path)
        if f is not None:
            self.path = "/" + f.relative_to(ROOT).as_posix()
        return super().send_head()


BROWSER_JS = r"""
const { chromium } = require('playwright');
(async () => {
  const [base, shots] = process.argv.slice(2);
  const browser = await chromium.launch();
  const out = { errors: [], overflow: [] };
  for (const [w, h, name] of [[1440, 900, 'home-1440.png'], [390, 844, 'home-390.png']]) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: w < 500 ? 2 : 1 });
    page.on('console', m => { if (m.type() === 'error') out.errors.push(`${w}: console ${m.text()}`); });
    page.on('pageerror', e => out.errors.push(`${w}: pageerror ${e.message}`));
    page.on('requestfailed', r => out.errors.push(`${w}: requestfailed ${r.url()}`));
    page.on('response', r => { if (r.status() >= 400) out.errors.push(`${w}: HTTP ${r.status()} ${r.url()}`); });
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const sw = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
    if (sw[0] > sw[1]) out.overflow.push(`${w}: scrollWidth ${sw[0]} > ${sw[1]}`);
    if (shots) {
      await page.evaluate(async () => {
        document.querySelectorAll('img[loading=lazy]').forEach(i => { i.loading = 'eager'; });
        for (const i of document.images) { i.scrollIntoView(); await new Promise(r => setTimeout(r, 150)); try { await i.decode(); } catch (e) {} } window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 400)); const h = document.querySelector(".site-head"); if (h) h.style.position = "absolute";
      });
      await page.screenshot({ path: `${shots}/${name}`, fullPage: true });
    }
    await page.close();
  }
  await browser.close();
  console.log(JSON.stringify(out));
})().catch(e => { console.log(JSON.stringify({ errors: ['runner ' + e.message], overflow: [] })); });
"""


def run_browser(shots: str | None) -> list[str]:
    node = shutil.which("node")
    if not node:
        return ["BROWSER    node not found; the browser check cannot run"]
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Handler, directory=str(ROOT)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    env = dict(os.environ)
    npm = shutil.which("npm")
    if npm:
        root = subprocess.run([npm, "root", "-g"], capture_output=True, text=True).stdout.strip()
        env["NODE_PATH"] = os.pathsep.join(filter(None, [env.get("NODE_PATH"), root]))
    with tempfile.NamedTemporaryFile("w", suffix=".cjs", delete=False) as fh:
        fh.write(BROWSER_JS)
        script = fh.name
    try:
        args = [node, script, f"http://127.0.0.1:{server.server_address[1]}"] + ([shots] if shots else [])
        res = subprocess.run(args, capture_output=True, text=True, env=env, timeout=180)
    finally:
        server.shutdown()
        os.unlink(script)
    try:
        data = json.loads(res.stdout.strip().splitlines()[-1])
    except (ValueError, IndexError):
        return [f"BROWSER    runner failed: {(res.stderr or res.stdout).strip()[:300]}"]
    return [f"BROWSER    {e}" for e in data["errors"]] + [f"BROWSER    overflow {o}" for o in data["overflow"]]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--shots", help="directory for full-page screenshots")
    ap.add_argument("--no-browser", action="store_true", help="skip the headless browser pass")
    args = ap.parse_args()

    out: list[str] = []
    external: list[str] = []
    page = Page()
    page.feed(HTML.read_text())
    for line, text in page.texts:
        check_text(f"index.html:{line}", text, out)
    for line, css in page.styles:
        check_hex(f"index.html:{line} <style>", css, out)
    for line, val in page.colors:
        check_hex(f"index.html:{line}", val, out)
    for line, ref in page.links:
        check_link(f"index.html:{line}", HTML, ref, page.ids, out, external)

    css = CSS.read_text()
    check_hex("home.css", css, out)
    for m in re.finditer(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)", css):
        line = css.count("\n", 0, m.start()) + 1
        check_link(f"home.css:{line}", CSS, m.group(1), page.ids, out, external)

    if not args.no_browser:
        out += run_browser(args.shots)

    for f in out:
        print(f)
    for e in sorted(set(external)):
        print(f"external   {e} (not fetched)")
    texts = len(page.texts)
    links = len(page.links)
    if out:
        print(f"FAIL: {len(out)} finding(s) across {texts} text runs and {links} links")
        return 1
    print(f"OK: {texts} text runs, {links} links, colors within neutral + corporate red"
          + ("" if args.no_browser else ", browser clean at 1440 and 390"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
