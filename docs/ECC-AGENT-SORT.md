# ECC agent-sort — controlfreak-platform-public

Date: 2026-10-25 (America/New_York). Confirmed for commit (James via Chief): finish configure-ecc / agent-sort only; **no** `products/` or `demos/` shells and no customer-facing publish until a later cue.

## STACK

- **Today:** markdown-only public twin (`PUBLIC.md`, `AGENTS.md`, `products/`, `demos/`, `docs/`). No `package.json`, no app source yet.
- **Intended:** marketing-safe Wave 1+ *Pro* product websites + per-product in-site demo content/behavior.
- **Sibling evidence (Design, not this repo):** static HTML + CSS + JS product demo template; Python `build.py` → `dist/` for pool site. Product industry sites must **not** clone pool Resort look — only parent lockup rules ([PARENT_BRAND](https://github.com/Jimmyneox/controlfreak-design/blob/main/brand/PARENT_BRAND.md)).
- **Harness:** Grok Bot with user plugin `ecc` id `70842154` (shared). Claude Code / Codex `configure-ecc` paths do not apply here; plugin skills are already available.

## configure-ecc (this harness)

| Item | Status |
|---|---|
| ECC plugin installed (user-wide) | Yes — `70842154` |
| Claude Code `configure-ecc` wizard | **N/A** — no `claude` CLI / Claude Code harness on this bot |
| Codex / Kimi install paths | Not used |
| Action | Keep shared plugin; do not invent a Claude project install unless James also runs Claude Code on this repo and picks scope + hook mode |

## DAILY (load every session on this repo)

| Component | Evidence |
|---|---|
| `ecc-guide` | Day-1 prime; answer ECC questions from live surface |
| `ecc-recipes` | Day-1 prime; map workflows to ECC command groups |
| `coding-standards` | Any front-end / demo code we add |
| `frontend-patterns` | Product sites + demo UI (HTML/CSS/JS or React/Next if chosen) |
| `frontend-design-direction` | Industry-specific public surfaces; avoid pool reskins |
| `tdd-workflow` | Day-1 prime; tests before behavior for demo logic |
| `verification-loop` | Day-1 prime; build/lint/test/security/diff before done |
| `git-workflow` | Public repo commits/PRs |
| `github-ops` | Issues/PRs on Jimmyneox/controlfreak-platform-public |
| `security-review` | Public repo — no secrets, no private platform leaks |
| `codebase-onboarding` | Thin repo today; grows with each product shell |
| `blueprint` | Multi-product Wave 1+ construction plans |
| `browser-qa` | Post-deploy / local demo verification (Chrome DevTools MCP present) |
| `seo` | Marketing product landing pages |

## LIBRARY (searchable, not default-loaded)

| Component | Evidence |
|---|---|
| `backend-patterns` | No backend in this public twin yet |
| `django-*` / `springboot-*` / `rails-*` / `laravel-*` / `nestjs-*` | Off-stack |
| `swiftui-*` / `ios-*` / `android-*` / `react-native-*` | App Store / native stay out of this public repo |
| `healthcare-*` / `homelab-*` / DeFi / trading | Off-domain |
| `investor-*` / `content-engine` / social publishers | Not primary ownership |
| Language-specific rules for unused stacks | Keep searchable only |

## INSTALL PLAN

1. **Harness:** keep user-wide ECC plugin (`70842154`). Do **not** run Claude Code `configure-ecc` unless James also uses Claude Code against this repo and picks `project|user|local` + hook mode.
2. **Project docs:** this file under `docs/` (committed).
3. **Optional later:** if Claude Code project scope is wanted, add selective `.claude/` DAILY skills only — never dump full ECC into the public tree.
4. **Hooks:** none until a real build/test toolchain exists in-repo.
5. **Product work:** hold `products/` and `demos/` scaffolds until James cues a product after a Platform/Writer marketing-safe brief.

## VERIFICATION

- [x] Tip at agent-sort write-up: `1d51f3547d35869e40e9b60e477389810a0bc01e`
- [x] Repo file inventory: markdown scaffold only
- [x] Design demo-template path known (chrome stays in controlfreak-design)
- [x] James OK to commit this doc; hold product shells
- [x] No `.claude/` or private platform content in this commit

## OPEN (later)

1. Site stack preference for product shells (static HTML matching Design demo-template vs Next/React) — when product work is cued.
2. First public Wave 1 *Pro* shell + Writer marketing-safe brief — queued with Platform/Writer; not blocking this doc.
