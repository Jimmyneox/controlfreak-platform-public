# Cold Plunge Control Pro — marketing-safe public brief

**Product pick:** C01 · Wave 1 *Pro* (folder stays `products/C01-cold-plunge/`)  
**Brand:** **Cold Plunge Control Pro**, brought to you by Control Freak  

Mark all concept visuals **Concept**. Parent attribution = **PCB circuit CONTROL FREAK corporate wordmark only** (PARENT_BRAND v1.4, owned by Design on `controlfreak-design`). Never introduce a second company name, and never reintroduce the earlier retired placeholder name.

---

## 1. One-line promise

**Proposed primary headline (James may reopen):**  
**Your plunge, ready when you are.**

**Proposed sub:**  
*Set “ready by 6:30.” Cold Plunge Control Pro works back from the water temperature, starts your chiller early, and keeps the water clean and flowing — so you just step in.*

Buyer open (every Wave 1+ product): *How many apps do you have to open to control your smart products?* Then: Cold Plunge Control Pro ships with Home Assistant and the Control Freak integration already set up, so your plunge and the rest of your smart home meet in one place. Connect the apps and devices you already own and simplify to a single app. Multi-platform integration built in: ask Alexa what the status is, tell Google to adjust the temperature, and receive automated voice alerts to let you know when something is out of balance. Alerts reach you by push, text, email or alarm — including when you’re away. Home Assistant stays on your home network — never cloud Home Assistant.

---

## 2. Who it’s for

- Owners of a tub plus a separate plug-in chiller (stock-tank, barrel or chest plunges) who want the water at temperature on schedule, without babysitting a thermostat.
- Hot/cold tub owners who switch between a warm soak and a cold plunge.
- Home Assistant users who couldn’t get local control of their chiller.

Self-install: plug the chiller, pump, ozone and UV into the Power Hub, drop in the probes, fit the flow switch on the pipe (Pro includes unions — no pipe cutting), scan the QR code.

---

## 3. The problem today

- Most plunges run on the chiller’s own basic thermostat or a Wi-Fi plug. Schedules are unreliable — owners report water still a few degrees warm at the set time.
- A clogged filter slows flow to a trickle and the chiller shuts off — or runs dry and wears out.
- Closed apps go offline after a router change, and a chiller is stranded if its maker disappears.
- Cost of doing nothing: cold mornings with warm water, cloudy water, and a worn-out chiller you have to replace.

---

## 4. Differentiator bullets (public-safe)

- **Ready when you are** — set “ready by 6:30”; the controller starts cooling early so the water is at your target when you step in.
- **Holds your temperature** — a water probe keeps the plunge at the target you set, all day.
- **Works with the chiller you have** — runs a 120 V plug-in chiller from the Power Hub; keep your chiller, and swap in a new one later without changing the rest. *(Say “switches your chiller’s power,” never “sets your chiller’s temperature” or “works with every chiller.”)*
- **Chiller only runs with water flowing** — a flow switch on the pipe stops the chiller running dry.
- **Clean water on a schedule** — ozone and UV run only while the pump moves water; filtration cycles keep it clear without the pump running all day.
- **Filter reminder (Pro)** — tells you to clean the filter before flow drops.
- **Chiller health (Pro)** — a probe on the chiller outlet shows it’s cooling, and flags early if it slows down.
- **Hot and cold in one tub (Pro)** — heater outlet switches between a warm soak and a cold plunge on a schedule.
- **Winter mode** — the pump runs when the air nears freezing, protecting outdoor tubs and pipes.
- **Keeps working when the internet doesn’t** — schedules run on the controller. Ethernet, Wi-Fi, and its own Wi-Fi network.
- **Alerts that reach you** — no flow, water too warm, filter, cold night: push, text, email and alarm, including away from home (cloud via Tailscale).
- **Home Assistant pre-installed** — Control Freak integration already set up, local on your home network. Multi-platform integration built in: ask Alexa what the status is, tell Google to adjust the temperature, and receive automated voice alerts when something is out of balance.

No health or recovery claims, no competitor names or ratings on the public site.

---

## 5. What’s in the box (buyer-facing)

Wave 1 public story **leads with Pro (building now)**; **Starter is coming later**. No Control Freak prices on the site until announced (“Price to be announced”).

**Starter (coming later):**
- Controller with Home Assistant pre-installed and the Control Freak integration
- Power Hub — labelled outlets for chiller, pump, ozone and a spare
- Water and air temperature probes
- Flow switch
- Keyed, colour-coded cables

**Pro (building now) — everything in Starter, plus:**
- Chiller-outlet probe (chiller health)
- Filter pressure sender (filter reminder)
- Plumbing unions — fits without cutting pipes
- Heater outlet for hot/cold tubs

**Your tub, chiller, pump, ozone and UV aren’t in the box** — you keep the ones you have. Never show them in a kit shot.

Optional one-liner for makers: *Building a tub or chiller? Ask about the OEM board.* (keep light).

**Not promised on the public site:** setting a chiller’s own target over its app or protocol, compatibility with every chiller, health/recovery benefits, session tracking or breathing guides, commercial multi-tub systems, water chemistry balancing, any safety listing, any subscription, cloud Home Assistant.

---

## 6. In-site demo — content and behavior

Design owns parent demo chrome/template. This section is **per-product demo content** only — cold, calm wellness look, **not** a pool or reef reskin. Leave room in the layout for the demo block beside or below the hero (web) and a “Watch the demo” pointer in the brochure.

### Feel
- Crisp and calm: ice whites, slate, deep cool blue; dawn light. Amber for “keep an eye on,” red only for a tapped “what if” alert.
- Product mark **Cold Plunge Control Pro** leading; eyebrow/footer *brought to you by Control Freak* (PCB corporate wordmark).
- Simulated phone / panel labelled **demo** / **example readings** — never live hardware.

### Home screen (simulated)

| Tile | Example state | Behavior |
|---|---|---|
| Status line | “39 °F · ready at 6:30 · flow OK” | Summary |
| Water temp ring | 39 °F, target 39 °F | Ring fills toward target |
| Ready by | 6:30 | Tap to change; shows “starts cooling at 4:50 (example)” |
| Chiller | Running / idle | Only runs while flow tile is OK |
| Flow | OK | Tappable “what if”: no flow → chiller stops, alert |
| Ozone / UV | On with pump | Caption: “only while water is moving” |
| Filter (Pro) | Clean / amber | Amber: “clean the filter soon” |
| Chiller health (Pro) | Cooling normally | Example outlet reading |
| Air temp / winter mode | 30 °F · pump on | Freeze protection example |
| Alerts | Sample list | Channels named: push, text, email, alarm |
| Home hub / voice | Chip | “Multi-platform integration built in” · “Ask Alexa if the plunge is ready” |

### Demo interactions
1. **Set ready-by time** → timeline shows cooling start and water reaching target at the set time.
2. **Clog the filter** (Pro) → pressure rises, filter reminder, then flow alert; chiller stops safely.
3. **Cold night** → air drops, winter mode runs the pump.
4. **Hot/cold switch** (Pro) → heater outlet on for a warm soak, then back to plunge.

No live cloud, no App Store links, no login wall. CTA sits beside or below the demo.

---

## 7. Brand and visual notes
- Industry-specific: cold plunge / ice bath (unbranded stock tank or barrel on a deck at dawn, plain chiller beside it, controller on the wall).
- Voice: sit back — the plunge is ready when you are. Benefit first, one line of detail; no jargon.
- Lockup: product name first; nested under *brought to you by Control Freak* (PCB corporate wordmark only, v1.4).
- Label every unbuilt kit, render or app mock **Concept**.
- Don’ts: no health/medical imagery or claims, no competitor logos, no invented testimonials, no CF dollar amounts, no tub or chiller in the kit, never the retired earlier placeholder name.

---

## 8. Public CTA
Primary: **Join the beta** / interest list.  
*We’re looking for cold plunge owners to test Cold Plunge Control Pro at home before launch.*  
Secondary: watch the demo (scroll to in-site demo).

---

## 9. Hand-off checklist for ECC / Design
- [ ] Site shell uses this brief only (no private engineering or cost docs)
- [ ] In-site demo wired with tiles and ready-by / filter / cold-night / hot-cold interactions
- [ ] Pro leads; Starter shown as coming later; no prices
- [ ] No tub/chiller in kit shots; no health claims; chiller language = “switches power”
- [ ] Concept labels on all unbuilt art; PCB corporate wordmark attribution
- [ ] CTA = beta interest

---


*Marketing-safe public slice (scrubbed for the public repo, 2026-10-26).*
