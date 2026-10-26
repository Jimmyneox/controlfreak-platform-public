# O04 · Reef Control Pro — public shell

**Status:** Shell v1.1 (polish: coral-teardrop product mark, PCB corporate attribution lockup v1.4, locked brochure voice) (static landing page + simulated in-site demo). Concept visuals, no prices, beta CTA only.

- `PUBLIC_BRIEF.md` — marketing-safe brief (source of truth for copy + demo tiles)
- `site/index.html` + `site/styles.css` — landing page (reef visual system: dark ocean / teal / coral)
- `site/demo/` — canonical in-site demo. Chrome (`demo.css`, `demo.js`) copied from Control Freak Design `site/demo-template/`; reef extensions in `reef.css` / `reef.js`. All values fake, client-side, no network.

## Open locally
```
cd products/O04-reef/site && python3 -m http.server 8000
# http://localhost:8000/  and  http://localhost:8000/demo/
```

## Open items
- Beta CTA is a `mailto:` placeholder — swap for a real signup when one exists.
- Concept visuals pending Design artwork.
