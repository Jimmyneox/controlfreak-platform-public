# c01 · Cold Plunge Control Pro — public shell

**Status:** Shell v1 (static landing page + simulated in-site demo). Concept visuals, no prices, beta CTA only.

- `PUBLIC_BRIEF.md` — marketing-safe brief (source of truth for copy + demo tiles)
- `site/index.html` + `site/styles.css` — landing page (cold plunge visual system: ice white, slate, deep cool blue, dawn light; amber = watch)
- `site/demo/` — in-site demo. Chrome (`demo.css`, `demo.js`) copied from Control Freak Design `site/demo-template/`; product layer in `c01.css` / `c01.js`. All values fake, client-side, no network.
- Attribution: PCB corporate wordmark lockup (PARENT_BRAND v1.4, `brought-to-you-by-control-freak-horizontal-light.svg`). Product name is text-led until Design locks a product mark.

## Open locally
```
cd products/C01-cold-plunge/site && python3 -m http.server 8000
```

## Open items
- Beta CTA is a `mailto:` placeholder.
- Product mark: none locked yet (text-led). Concept hero is a CSS placeholder pending Design artwork.
