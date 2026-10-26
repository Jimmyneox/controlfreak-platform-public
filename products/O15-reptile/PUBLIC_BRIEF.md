# Terrarium Control Pro — marketing-safe public brief

**Audience:** Control Freak Platform ECC / public site shell + in-site demo  
**Product pick:** O15 · Wave 1 *Pro* (folder stays `products/O15-reptile/`)  
**Brand:** **Terrarium Control Pro**, brought to you by Control Freak  
**Source scrub:** buyer-facing copy only, drawn from `README.md`, `02-features.md`, `DESIGN_BRIEF.md` and `src/content.json`. No board I/O, costs or prices. Safe to hand to the public ECC twin as-is.

Mark all concept visuals **Concept**. O15 already has soft-UI hero, infographic and brochure concepts — optional to keep; new chrome follows Design on `controlfreak-design`.

---

## 1. One-line promise

**Put the Control Freak on it.** Sit back and enjoy your enclosures — the system keeps the heat, light and mist on schedule.

Supporting line (from `src/content.json`): *Heat, light and misting for up to three enclosures. From one controller. No subscription.*

Buyer open (every Wave 1+ product): *How many apps do you open to run your home?* Then: Terrarium Control Pro ships with Home Assistant and the Control Freak integration already set up, so your enclosures and the rest of your smart home meet in one place. Connect the devices you already own and simplify to a single app. Multi-platform integration built in: ask Alexa what the status is, tell Google to adjust the temperature, and receive automated voice alerts when something is out of balance. Alerts reach you by push, text, email or alarm — including when you're away. Home Assistant runs on the controller on your home network — not in someone else’s cloud.

---

## 2. Who it's for

Keepers running 1–3 enclosures — often with animals they've invested a lot in — who want each heat source holding its own setpoint, lights on a natural day, and misting on time, without stacking a separate thermostat per enclosure or juggling vendor apps. Hands-on hobbyists and breeders who often already run (or want) Home Assistant and care that heat keeps being controlled when Wi-Fi or a cloud app hiccups.

---

## 3. Differentiator bullets (public-safe)

- **One kit for 2–3 enclosures** — 8 switched outlets and 4 temperature probes, with a thermostat on any outlet, instead of one thermostat per enclosure.
- **Heat control stays in your home** — the controller runs heat locally, so a Wi-Fi drop or a server outage changes nothing.
- **Over-temperature cutoff and probe check** — if a probe reads too hot, or is unplugged, its heat outlet turns off and you're told. (Say exactly that — no fire-safety claims.)
- **Home Assistant pre-installed, with full control** — Control Freak integration already set up; setpoints and outlets work from your dashboards, not read-only. Multi-platform integration built in.
- **Safety rules don’t depend on Home Assistant** — Control Freak’s own safety rules — over-temperature cutoff and the unplugged-probe check — keep running on the controller, even if Home Assistant stops.
- **Day/night cycles and seasonal ramps** — lights and temperatures follow a natural day, with editable profiles to start from.
- **Misting on schedule** — timed misting from a switched outlet. *(Concept, pending confirmation: reservoir float that stops misting before it runs dry, and a door switch that pauses misting and fans while you're feeding.)*
- **Set up in minutes** — scan the QR code; keyed, colour-coded plugs only fit their port.
- **Built on a controller we already ship** — the same controller as Control Freak's live pool product, not a one-off board.
- **Works with the Control Freak gear you already own** — every Control Freak product is a complete kit on its own. If a Control Freak controller you already have has a free port or relay, Home Assistant can put it to work for this product too. (Owner 2026-10-26: separate products, combinable in Home Assistant through open ports.)

Do **not** name competitor products on the public site unless Design/Platform ask for a sourced comparison table later (sourced facts live in `01-market.md`). Dimming is **not** a differentiator and not a shipping Power Hub feature — don't position it as one.

---

## 4. What's in Terrarium Control Pro (buyer-facing kit)

Wave 1 public story = **one Pro product**. No Control Freak prices on the site until announced ("Price to be announced").

**In the Pro kit (buyer language):**

- Controller with Home Assistant pre-installed and the Control Freak integration
- Power Hub — 8 switched outlets (heat mats, ceramic emitters, UVB, day lights, fans, mister)
- 4 temperature probes (hot side, cool side, basking spot, second enclosure)
- Door switch and mister reservoir float — **Concept** (pending confirmation)

Power Hub outlets are **on/off only**.

**Concept — Pro dimming story (not a Power Hub feature):** a separate mains dimming module for heat bulbs is a **Concept** accessory. Neither the Power Hub nor the controller dims mains lamps.

**Sold separately / later (optional mention):** Control Freak temperature and humidity sensor over Modbus — **later, when Modbus sensor support lands** (not a Wave 1 cart line). Extra temperature probes; a second Power Hub. Several controllers in one app for racks is **later** — don't promise it.

**Home Assistant path (not a CF cart line):** **Add humidity through Home Assistant.** Owners can use a Zigbee, Z-Wave, or Wi‑Fi wireless humidity sensor with the pre-installed Home Assistant hub. That is the owner’s HA gear — not listed under In the Pro kit, and not a Control Freak cart line. (A Control Freak Modbus humidity sensor remains later / P2.)

**Not promised on the public site:** a Control Freak humidity sensor or humidity control in the Wave 1 kit, any dimming from the Power Hub or controller (the Hub is on/off only; dimming is a separate Concept module), controlling brand lamps over Bluetooth, rack-scale multi-controller management, cameras / weight logs / feeding diaries, fire prevention of any kind, species care guarantees, any subscription.

---

## 5. In-site demo — content and behavior

Design owns parent demo chrome/template (`controlfreak-design`). This section is **per-product demo content** only — terrarium/vivarium look, **not** a pool, reef or basement reskin.

### Feel

- Warm basking-light cues in the scene (planted glass terrarium on a shelf); app and cards stay in the house palette — aqua for "on", coral only for warnings.
- Product mark: **Terrarium Control Pro** leading; footer / eyebrow lockup: *brought to you by Control Freak*.
- Simulated phone or embedded panel labeled **demo** / **example readings** — never live hardware. No animal close-ups suggesting a tested species.

### Home screen (simulated — example values from `DESIGN_BRIEF.md`)

| Tile / region | Example demo state | Behavior |
|---|---|---|
| Gradient strip | Cool side 78 °F → Hot side 92 °F → Basking 105 °F | Three readings, each with its own setpoint; "example reading" label |
| Humidity (optional) | e.g. 60 % · **HA-added** | Only if demo shows owner HA wireless sensor — not CF kit |
| Day/night | "Day · 14:00" | Chip; tap shows the day/night cycle |
| Mist | "Next mist 18:00" · reservoir OK (**Concept**) | Status chip; reservoir-low state as a demo "what if" — label Concept |
| Power Hub strip | 8 labelled outlets | e.g. Heat mat, Ceramic emitter, Basking lamp, UVB, Day light, Mister, Fan, Spare  (all on/off) |
| Cutoff hint | Short caption | "Too hot or a probe unplugged: heat turns off and you're told." |
| Modes | Night / Away | One-tap |
| Alerts | Sample alert list | Over/under temp, probe unplugged, outlet stuck on, empty reservoir (**Concept**) — channels named push / text / email / alarm |
| Voice / home | Chip | "Multi-platform integration built in" · "Tell Google to adjust the temperature" |

### Demo interactions (keep light)

1. Drag or tap a setpoint on the gradient strip → reading eases toward it.
2. **Concept:** tap **Door open** → misting and fan pause; close → resume (label Concept).
3. Tap a day/night chip → lights and setpoints switch to night values.
4. Optional "Alert example" button → sample over-temperature card showing the heat outlet switched off.

Humidity tile is **optional** in the Wave 1 demo only if labelled **HA-added** (owner’s wireless humidity sensor via Home Assistant) — never as a Control Freak kit reading. A Control Freak Modbus humidity sensor is later, not Wave 1. No live cloud, no App Store links, no login wall for the demo. CTA sits beside or below the demo, not inside a fake checkout.

---

## 6. Brand and visual notes

- **Industry-specific:** reptile / terrarium / vivarium (planted glass enclosures, shelves and racks, warm basking light). No pool, reef or basement imagery or flows.
- **Lockup:** product name first (**Terrarium Control Pro**); always nest under *brought to you by Control Freak*. Parent brand/demo chrome owned by Design.
- **Soft-UI:** existing O15 hero/infographic/brochure concepts are optional to keep; don't force them if Design's shell has moved on.
- **Concept labelling:** every unbuilt kit or app mock is marked **Concept**.
- **Copy rules:** benefits with a line of detail; no jargon, no fear words.

---

## 7. Public CTA

Primary: **Join the beta** / interest list.

Suggested line (from `src/content.json`):  
*We're looking for keepers with two or more enclosures to test Terrarium Control Pro before launch.*

Secondary (optional): watch the demo (scroll to in-site demo).

No App Store badges, no internal status, no engineering-gate or certification language on the public page.

---

## 8. Hand-off checklist for ECC / Design

- [ ] Site shell uses this brief only (no private engineering, I/O or cost docs)
- [ ] In-site demo wired with the terrarium tiles above
- [ ] Soft-UI: reuse O15 assets or Design shell — deliberate choice
- [ ] CTA = beta interest
- [ ] All concept art labeled **Concept**
- [ ] Prices absent until publicly announced

## 9. Don'ts

- No fire-safety claims ("prevents fires", "fire-safe"). The cutoff turns an outlet off on over-temperature — say exactly that.
- Don't say "dimming on every outlet", and never imply the Power Hub or controller dims mains lamps — the Hub is on/off; dimming is a separate Concept module.
- Don't show humidity as a Wave 1 Control Freak kit reading. HA-added humidity (owner wireless sensor) may appear only if labelled HA-added. CF Modbus humidity is later.
- No species care claims ("perfect for any reptile"); profiles are editable starting points.
- No competitor names, logos or photos; no invented testimonials or reviews.
- No Control Freak dollar amounts, costs, board part numbers or pinouts.
- No Control Freak humidity sensor in the Wave 1 kit; HA wireless humidity is owner gear, labelled HA-added if shown.
- Don’t pitch Home Assistant as a cloud service; it runs on the controller on your home network. Away alerts reach your phone, but Home Assistant itself stays home.
- No rack/multi-controller promises.

---

*CFP Product Writer · public-safe slice for Platform → ECC · 2026-10-25*
