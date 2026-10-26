# o15 · Terrarium Control Pro — public shell

**Status:** Shell v1 (static landing page + simulated in-site demo). Concept visuals, no prices, beta CTA only.

- `PUBLIC_BRIEF.md` — marketing-safe brief (source of truth for copy + demo tiles)
- `site/index.html` + `site/styles.css` — landing page (terrarium visual system: warm dark bark/olive, basking amber, leaf green; aqua = on, coral = warning)
- `site/demo/` — in-site demo. Chrome (`demo.css`, `demo.js`) copied from Control Freak Design `site/demo-template/`; product layer in `o15.css` / `o15.js`. All values fake, client-side, no network.
- Attribution: PCB corporate wordmark lockup (PARENT_BRAND v1.4, `brought-to-you-by-control-freak-horizontal-cream.svg`). Product name is text-led until Design locks a product mark.

## Open locally
```
cd products/O15-reptile/site && python3 -m http.server 8000
```

## Open items
- Beta CTA is a `mailto:` placeholder.
- Product mark: none locked yet (text-led). Concept hero is a CSS placeholder pending Design artwork.
