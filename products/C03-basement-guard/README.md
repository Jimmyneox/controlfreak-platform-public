# c03 · Basement Guard Pro — public shell

**Status:** Shell v1 (static landing page + simulated in-site demo). Concept visuals, no prices, beta CTA only.

- `PUBLIC_BRIEF.md` — marketing-safe brief (source of truth for copy + demo tiles)
- `site/index.html` + `site/styles.css` — landing page (basement visual system: concrete greys, slate, safety-blue; amber = watch)
- `site/demo/` — in-site demo. Chrome (`demo.css`, `demo.js`) copied from Control Freak Design `site/demo-template/`; product layer in `c03.css` / `c03.js`. All values fake, client-side, no network.
- Attribution: PCB corporate wordmark lockup (PARENT_BRAND v1.4, `brought-to-you-by-control-freak-horizontal-dark.svg`). Product name is text-led until Design locks a product mark.

## Open locally
```
cd products/C03-basement-guard/site && python3 -m http.server 8000
```

## Open items
- Beta CTA is a `mailto:` placeholder.
- Product mark: none locked yet (text-led). Concept hero is a CSS placeholder pending Design artwork.
