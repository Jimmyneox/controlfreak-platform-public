# Reef Control Pro — marketing-safe public brief

**Audience:** Control Freak Platform ECC / public site shell + in-site demo  
**Product pick:** O04 · first Wave 1 *Pro* for public site  
**Brand:** **Reef Control Pro**, brought to you by Control Freak  
**Source scrub:** buyer-facing copy only (problem, kit story, features, brochure tone). This file is safe to hand to the public ECC twin as-is.

Mark all concept visuals **Concept**. Soft-UI assets already exist for O04 — optional to keep; new chrome follows Design on `controlfreak-design`.

---

## 1. One-line promise

**A reef controller that plugs together.** Keeps working when the internet doesn’t. No subscription.

Buyer open (every Wave 1+ product): *How many apps do you have to open to control your smart products?* Then: Home Assistant comes pre-installed with the Control Freak integration, so the tank and the rest of the home land in one place — and you can simplify to a single app. Multi-platform integration built in: ask Alexa what the status is, tell Google to adjust the temperature, and receive automated voice alerts to let you know when something is out of balance. Home Assistant itself stays on your home network.

---

## 2. Who it’s for

Reef hobbyists with a sump tank who want reliable control and alerts without wiring a DIY board or juggling five vendor apps. Hands-on keepers who read the forums, often already run (or want) Home Assistant, and care that pumps and heaters keep doing the right thing when Wi-Fi or a cloud app hiccups.

---

## 3. Differentiator bullets (public-safe)

- **Keeps working when the internet doesn’t** — the box under the stand runs the tank; a Wi-Fi drop or server outage doesn’t change what pumps and heater do. Ethernet, Wi-Fi, and its own Wi-Fi network as a fallback.
- **Home Assistant pre-installed** — Control Freak integration already set up; one hub for tank and home. Multi-platform integration built in: ask Alexa what the status is, tell Google to adjust the temperature, and receive automated voice alerts when something is out of balance.
- **Auto water leveling and leak alarm in the kit** — tops up evaporation with an overfill lockout; sensor under the stand alerts you to water on the floor. Add only a reservoir.
- **Pumps keep running if the controller loses power** — return pump and powerheads stay on; the heater turns off and falls back to its own thermostat.
- **Heater cutoff** — temperature probes watch the tank; the heater switches off above your limit.
- **Set up in minutes** — scan the QR code; keyed, colour-coded plugs fit one way.
- **Pro dosing and pH** — three-head doser for calcium, alkalinity, and magnesium; pH on the home screen.
- **Works with the Control Freak gear you already own** — every Control Freak product is a complete kit on its own. If a Control Freak controller you already have has a free port or relay, Home Assistant can put it to work for this product too. (Owner 2026-10-26: separate products, combinable in Home Assistant through open ports.)

Do **not** name competitor products or quote their app ratings on the public site unless Design/Platform explicitly ask for a sourced comparison table later. Prefer benefit language above.

---

## 4. What’s in Reef Control Pro (buyer-facing kit)

Wave 1 public story = **one Pro product**. No Control Freak prices on the site until announced.

**In the Pro kit (buyer language):**

- Controller with Home Assistant pre-installed and the Control Freak integration
- Power Hub — 8 switched outlets (pumps, heater, lights, skimmer, and more)
- Temperature probes (two in the kit; room for more)
- Auto top-off pump and level sensors (add your own reservoir)
- Leak alarm sensor
- 3-head doser (calcium, alkalinity, magnesium)
- pH probe

**Sold separately / later (optional mention, not required on first page):** ORP and salinity probes, extra temperature probes, extra Power Hub for large systems, top-off reservoir.

**Not promised on the public site:** light dimming for brand LED protocols, automatic water changes, automatic chemistry correction from probe readings, more than eight outlets on one controller, any subscription.

---

## 5. In-site demo — content and behavior

Design owns parent demo chrome/template (`controlfreak-design`). This section is **per-product demo content** only — reef industry look, **not** a pool reskin.

### Feel

- Soft, calm aquarium lighting cues (deep blue / aqua accents on a light soft-UI surface if keeping O04 soft-UI; otherwise Design’s Wave 1 demo shell with a reef tint).
- Product mark: **Reef Control Pro** leading; footer / eyebrow lockup: *brought to you by Control Freak*.
- Simulated phone or embedded panel labeled as a **demo** / **example readings** — never live hardware.

### Home screen (simulated)

| Tile / region | Example demo state | Behavior |
|---|---|---|
| Tank temperature | e.g. 78.4 °F | Big number; small “Tank · example reading” label |
| Sump temperature | e.g. 77.9 °F | Secondary reading |
| pH | e.g. 8.2 | Pro home-screen tile |
| Power Hub strip | 8 labelled outlets | Toggles: Return, Powerhead 1, Powerhead 2, Heater, Chiller/fan, Main light, Refugium light, Skimmer. Demo: Return + powerheads **on**; Heater **off** or on within range |
| Fail-safe hint | Short caption | “If the controller loses power, return and powerheads stay on; heater turns off.” |
| Auto top-off | Level OK / topping up | Progress or status chip; never shows overfill |
| Leak | Dry / clear | Alarm state only as a tappable demo “what if” |
| Dosing | Ca / Alk / Mg | Three small countdown or schedule chips (refill reminders) |
| Modes | Feed / Maintenance | One-tap pause; auto-resume after a short demo timer |
| Alerts | Sample alert list | High temp, top-off lockout, leak — as demo notifications (push/text/email/alarm as channels named, not as vendor plumbing) |
| Voice / home | Chip | “Multi-platform integration built in” · “Ask Alexa what the status is; get voice alerts” (STYLE.md voice line) |

### Demo interactions (keep light)

1. Toggle an outlet → soft state change; heater toggle shows cutoff caption if demo temp is high.
2. Tap **Feed mode** → pumps pause, then resume.
3. Tap a dosing head → show next dose time / container countdown (example data).
4. Optional “Alert example” button → sample high-temp or leak card.

No live cloud, no App Store links, no login wall for the demo itself. CTA sits beside or below the demo, not inside a fake checkout.

---

## 6. Brand and visual notes

- **Industry-specific:** reef / aquarium (water, stand cabinet, sump, coral-safe calm UI). Do not reuse pool product photography or pool demo flows as a reskin.
- **Lockup:** product name first (**Reef Control Pro**); always nest under *brought to you by Control Freak*. Parent brand/demo chrome owned by Design.
- **Soft-UI:** O04 already has soft-UI brochure/hero/app concept assets — **optional to keep** for this product site. New shared demo chrome may differ; don’t force neumorphism on every surface if Design’s shell has moved on.
- **Concept labelling:** any unbuilt kit or app mock is marked **Concept**.
- **Don’ts:** no competitor logos in imagery; no invented testimonials; no CF dollar amounts; no board part numbers or pinouts; don’t pitch Home Assistant as a cloud service — it runs on the controller on your home network; no fear-mongering copy.

---

## 7. Public CTA

Primary: **Join the beta** / interest list — reef keepers testing Reef Control Pro on their own tanks before launch.

Suggested line (from existing brochure copy):  
*We’re looking for reef keepers to test Reef Control Pro on their own tanks before launch.*

Secondary (optional): learn more / watch the demo (scroll to in-site demo).

No App Store badges, no internal flush status, no engineering-gate or “shipping when X lands” language on the public page.

---

## 8. Hand-off checklist for ECC / Design

- [ ] Site shell uses this brief only (no private engineering or cost docs)
- [ ] In-site demo wired with reef tiles above
- [ ] Soft-UI: reuse O04 assets or Design shell — deliberate choice
- [ ] CTA = beta interest
- [ ] All concept art labeled **Concept**
- [ ] Prices absent until publicly announced

---

*CFP Product Writer · public-safe slice for Platform → ECC · 2026-10-25*
