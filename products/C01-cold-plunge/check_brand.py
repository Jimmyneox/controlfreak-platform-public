#!/usr/bin/env python3
"""Cold Plunge brand gate: fails on dash characters in visible text, "on the box",
and any CSS hex color outside the Calacatta at six palette.

Visible text = HTML text nodes, <title>, alt/title/aria-label/placeholder attributes,
meta descriptions, and string literals in the C01 product scripts (toasts, labels).
Shared demo chrome (demo.css, demo.js) is Design-owned and identical across products,
so it is not scanned; c01.js overrides the one shared string that carried a dash.
The stage tub is Design artwork inlined as <svg>; its internal <style> is Design-owned
and not C01 CSS, so hex colors inside <svg> are skipped (its text is still checked).

Usage: python3 products/C01-cold-plunge/check_brand.py   (exit 1 on any finding)
"""
from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path

SITE = Path(__file__).resolve().parent / "site"
HTML_FILES = [SITE / "index.html", SITE / "demo" / "index.html"]
JS_FILES = [SITE / "demo" / "c01.js", SITE / "demo" / "stage.js"]
CSS_FILES = [SITE / "styles.css", SITE / "demo" / "c01.css"]

# Ten decided colors, the five at-six working tints (#2E3033 counted once), the warning red.
PALETTE = {
    "F4F2EE", "D8D2CA", "C9CBC8", "C8BFAF", "8F8A83",
    "B8BBBE", "6E7276", "C6B18D", "A9C7C4", "2E3033",
    "49443F", "5B5147", "655E55", "7D756B",
    "A64B43",
}
# Alpha variants (#RRGGBBAA) of palette colors are allowed; a bare #000/#fff is not.
HEX_RE = re.compile(r"#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b")
DASH_RE = re.compile(r"[‒–—―−]|\s-\s|^-\s")
BOX_RE = re.compile(r"on\s+the\s+box", re.I)
JS_STRING_RE = re.compile(r'"(?:[^"\\\n]|\\.)*"|\'(?:[^\'\\\n]|\\.)*\'')
JS_COMMENT_RE = re.compile(r"/\*.*?\*/|(?<![:\"'])//[^\n]*", re.S)
VISIBLE_ATTRS = {"alt", "title", "aria-label", "placeholder"}


class TextCollector(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.texts: list[tuple[int, str]] = []
        self.scripts: list[tuple[int, str]] = []
        self.styles: list[tuple[int, str]] = []
        self._in: str | None = None
        self._svg = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        line = self.getpos()[0]
        a = dict(attrs)
        for k in VISIBLE_ATTRS:
            if a.get(k):
                self.texts.append((line, a[k] or ""))
        if tag == "meta" and a.get("name") == "description" and a.get("content"):
            self.texts.append((line, a["content"] or ""))
        if tag == "svg":
            self._svg += 1
        if tag in ("script", "style"):
            self._in = tag

    def handle_endtag(self, tag: str) -> None:
        if tag == "svg":
            self._svg = max(0, self._svg - 1)
        if tag in ("script", "style"):
            self._in = None

    def handle_data(self, data: str) -> None:
        line = self.getpos()[0]
        if self._in == "script":
            self.scripts.append((line, data))
        elif self._in == "style" and not self._svg:
            self.styles.append((line, data))
        elif data.strip():
            self.texts.append((line, data))


def js_strings(src: str) -> list[str]:
    return [m.group(0)[1:-1] for m in JS_STRING_RE.finditer(JS_COMMENT_RE.sub("", src))]


def check_text(where: str, text: str, out: list[str]) -> None:
    for line in text.splitlines() or [text]:
        if DASH_RE.search(line):
            out.append(f"DASH      {where}: {line.strip()[:110]}")
        if BOX_RE.search(line):
            out.append(f"ON-THE-BOX {where}: {line.strip()[:110]}")


def check_css(where: str, css: str, out: list[str]) -> None:
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    for m in HEX_RE.finditer(css):
        h = m.group(1).upper()
        rgb = h[:6] if len(h) in (6, 8) else ""
        if rgb not in PALETTE:
            out.append(f"HEX       {where}: #{m.group(1)} is not in the C01 palette")


def main() -> int:
    findings: list[str] = []
    scanned = 0
    for f in HTML_FILES:
        rel = f.relative_to(SITE.parent)
        p = TextCollector()
        p.feed(f.read_text(encoding="utf-8"))
        for line, t in p.texts:
            check_text(f"{rel}:{line}", t, findings)
            scanned += 1
        for line, s in p.scripts:
            for t in js_strings(s):
                check_text(f"{rel}:{line} <script>", t, findings)
                scanned += 1
        for line, s in p.styles:
            check_css(f"{rel}:{line} <style>", s, findings)
    for f in JS_FILES:
        for t in js_strings(f.read_text(encoding="utf-8")):
            check_text(str(f.relative_to(SITE.parent)), t, findings)
            scanned += 1
    for f in CSS_FILES:
        css = f.read_text(encoding="utf-8")
        check_css(str(f.relative_to(SITE.parent)), css, findings)
        for m in re.finditer(r'content:\s*"([^"]*)"', css):
            check_text(f"{f.relative_to(SITE.parent)} content", m.group(1), findings)
    hexes = sum(len(HEX_RE.findall(f.read_text(encoding="utf-8"))) for f in CSS_FILES)
    for line in findings:
        print(line)
    status = "FAIL" if findings else "PASS"
    print(f"{status}: {len(findings)} finding(s); {scanned} text strings, {hexes} CSS hex colors scanned")
    return 1 if findings else 0


if __name__ == "__main__":
    sys.exit(main())
