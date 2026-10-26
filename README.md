# Control Freak Platform (public / ECC twin)

Public twin of the private [controlfreak-platform](https://github.com/Jimmyneox/controlfreak-platform) planning repo, so **ECC (Everything Claude Code)** can run against a public GitHub home.

| Area | Path | Notes |
|---|---|---|
| Public rules | [`PUBLIC.md`](PUBLIC.md) | What must never land here |
| Wave 1 product sites | `products/` | Industry-specific public site / app shells (marketing-safe) |
| In-site demos | `demos/` | Per-product demo content/behavior (Design owns shared chrome on `controlfreak-design`) |
| Docs | `docs/` | Public-safe notes only |

**Ownership**

- **This repo + ECC twin bot:** public product websites, in-site demos, marketing-safe front-end work for Wave 1+ (*Pro* products).
- **[controlfreak-platform](https://github.com/Jimmyneox/controlfreak-platform)** (private) + Control Freak Platform bot: planning, DECISIONS, flush docs, board/CORE, scoring, private engineering.
- **[controlfreak-design](https://github.com/Jimmyneox/controlfreak-design)** (public) + Control Freak Design: parent brand, lockups, demo chrome/template, controlfreakpool.com.

Product apps/sites are **industry-specific** (not pool-site reskins). Shared brand piece is only the **parent lockup** ([PARENT_BRAND](https://github.com/Jimmyneox/controlfreak-design/blob/main/brand/PARENT_BRAND.md)).

ECC tools are enabled against this public repo.

## Deploy (personalizeduserexperiences.com)
Host: **Cloudflare Pages** (static, no build step). Path rewrites live in `_redirects`:
- `/` → Wave 1 hub (`index.html`)
- `/reef/` → `products/O04-reef/site/`
- `/basement-guard/` → `products/C03-basement-guard/site/`
- `/terrarium/` → `products/O15-reptile/site/`
- `/cold-plunge/` → `products/C01-cold-plunge/site/`
- `/<slug>/demo/` → that product's `site/demo/`; every other file under `/<slug>/*` maps into `site/` so relative assets work.
