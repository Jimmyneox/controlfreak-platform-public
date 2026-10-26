# Basement Guard Pro — marketing-safe public brief

**Product pick:** C03 · Wave 1 *Pro*  
**Brand:** **Basement Guard Pro**, brought to you by Control Freak  

Mark all concept visuals **Concept**. Parent brand / demo chrome is owned by Design on `controlfreak-design`.

---

## 1. One-line promise

**Proposed primary headline (James may reopen):**  
**Put the Control Freak on your basement.**

**Proposed sub:**  
*Two pumps, one watchful hub. Basement Guard Pro keeps an eye on the pit, the pipes and the floor — so you can stop listening for the pump every time it rains.*

Buyer open (every Wave 1+ product): *How many apps do you open to run your home?* Then: Basement Guard Pro ships with Home Assistant and the Control Freak integration already set up, so your sump, leak sensors and the rest of your smart home meet in one place. Connect the devices you already own and simplify to a single app. Multi-platform integration built in: ask Alexa what the status is, tell Google to adjust the temperature, and receive automated voice alerts to let you know when something is out of balance. Home Assistant stays on your home network — never cloud Home Assistant.

---

## 2. Who it’s for

- Homeowners with a basement sump — often right after a close call, or when replacing a pump — who want a second pump that actually takes turns, not a spare sitting in a box.
- Second-home and rental owners who can’t check the basement in person.
- Home Assistant users who have already built sump sensors by hand and want it done properly.

Self-install: set the pumps in the pit, plug them into the Power Hub, drop in the level sensor, scan the QR code. No rewiring.

---

## 3. Differentiator bullets (public-safe)

- **Two pumps take turns** — plug in the two pumps you already own; the lead pump swaps every week so both wear evenly, and the two never start at the same moment.
- **Second pump steps in** — if the water keeps rising, the second pump is brought in automatically and you get a note.
- **See the water level** — pit depth in inches and how fast it’s rising, not just “alarm / no alarm.”
- **Pumps work even if the controller doesn’t** — pump outlets stay on if the controller is ever off, and each pump keeps its own float switch. Your basement is never worse off than with plain pumps.
- **Pump check-up** — spots a slow pump-down or a pump that didn’t empty the pit, so you replace a tired pump on your schedule. Weekly pump test included.
- **Leak and freeze watch** — leak sensors by the water heater and washer, a high-water float as a second check, temperature probes for the basement, crawlspace and pipes; plug-in heat tape switches on when it gets cold.
- **Alerts that reach you** — push, text, email and alarm, including when you’re away (cloud via Tailscale), plus a siren in the house that sounds whether or not the internet is up.
- **Keeps working when the internet doesn’t** — pump rules and the siren run on the box in the basement.
- **Home Assistant pre-installed** — Control Freak integration already set up; one hub for basement and home. Multi-platform integration built in: ask Alexa what the status is, tell Google to adjust the temperature, and receive automated voice alerts when something is out of balance.

Do **not** name competitor products or quote their app ratings on the public site unless Design/Platform explicitly ask for a sourced comparison table later.

---

## 4. What’s in Basement Guard Pro (buyer-facing)

Wave 1 public story = **one Pro product**. No Control Freak prices on the site until announced.

**Recommended package (buyer language):**

- Controller with Home Assistant pre-installed and the Control Freak integration
- Power Hub — labelled outlets for two sump pumps plus plug-in heat tape, a dehumidifier and a spare
- Pit level sensor (water depth and rate of rise)
- High-water float (second check)
- Leak sensors (water heater + washer)
- Temperature probes (basement, crawlspace, water heater area, outdoor)
- Siren for inside the house
- Backup inverter hook-up — switches on an inverter you already own
- Keyed, colour-coded cables

**Your sump pumps aren’t in the box** — you keep the ones you have.

**Optional add-ons:** UPS (keeps the controller — and ideally your router — running in a power cut so alerts still go out); 12 V battery backup pump (keeps the pit emptying in a blackout; partner unit). Automatic water shutoff (closes the main when a leak sensor gets wet; sold as an option, plumber install).

**Not promised on the public site:** sewage ejector or commercial duplex pits, hardwired heat tape or dehumidifier as self-install, water shutoff as standard or self-install, pump energy monitoring, any amp/motor rating or safety listing, any subscription, cloud Home Assistant. Don’t say we make the backup pump, and don’t say alerts go out when the controller has no power.

---

## 5. In-site demo — content and behavior

Design owns parent demo chrome/template (`controlfreak-design`). This section is **per-product demo content** only — basement / home protection look, **not** a pool or reef reskin.

### Feel

- Calm, dependable, dry: concrete greys, slate and a clean safety-blue accent; amber for “keep an eye on,” red only for a tapped “what if” alarm.
- Product mark: **Basement Guard Pro** leading; footer / eyebrow lockup: *brought to you by Control Freak*.
- Simulated phone or embedded panel labelled **demo** / **example readings** — never live hardware.
- Leave room in the layout for the demo block beside or below the hero.

### Home screen (simulated)

| Tile / region | Example demo state | Behavior |
|---|---|---|
| Status line | “Pit at 6 in · Pump A ran 14 times today · both pumps healthy” | Headline summary after a storm |
| Pit level ring | e.g. 6 in, with start and high-water lines | Ring fills; small arrow shows rate of rise |
| Pumps | Pump A (lead) · Pump B (standby) | Shows which pump is up this week; last run time |
| Stagger caption | Short caption | “Never starts both pumps at once — the second waits its turn.” |
| Fail-safe hint | Short caption | “If the controller is ever off, both pumps still run on their own floats.” |
| Pump health | Healthy / amber | Amber example: “Pump A emptied the pit slower than usual — plan a replacement.” |
| Leak | Water heater: dry · Washer: dry | Alarm only as a tappable “what if” |
| High-water float | Clear | Second check |
| Temperatures | e.g. Basement 58 °F · Crawlspace 41 °F · Outdoor 22 °F | Example readings |
| Heat tape | Off / On | Turns on when the crawlspace probe drops below the demo setting |
| Dehumidifier | On schedule | Plug-in outlet toggle |
| Alerts | Sample alert list | High water, pump didn’t empty the pit, slow pump-down, leak, freezing pipes — channels named: push, text, email, alarm |
| Home hub / voice | Chip | “Multi-platform integration built in” · “Ask Alexa what the status is; get voice alerts” |

### Demo interactions (keep light)

1. **Simulate a storm** → level rises; lead pump runs; if it keeps rising, the second pump comes in *after a short delay* (stagger), with a “second pump stepped in” note; level falls.
2. **Weekly pump test** → each pump runs briefly in turn and reports OK.
3. **Swap lead pump** → Pump A / Pump B roles flip.
4. **Cold snap** → crawlspace temp drops; heat tape tile switches on.
5. Optional **Alert example** → sample leak or high-water card, siren icon.

No live cloud, no App Store links, no login wall for the demo. CTA sits beside or below the demo, not inside a fake checkout.

---

## 6. Brand and visual notes

- **Industry-specific:** basement / sump / home protection (pit, two pumps, utility corner, water heater, crawlspace pipes). Not pool imagery, not a reef reskin, no aquarium blues.
- **Voice:** peace of mind when you’re away — not babysitting the pit. Smooth, confident, reassuring; benefit first, one line of detail. No fear words, no jargon (“local-first,” port names).
- **Lockup:** product name first; always nest under *brought to you by Control Freak*. Parent chrome owned by Design.
- **Concept labelling:** any unbuilt kit, render or app mock is marked **Concept**.
- **Don’ts:** no competitor logos; no invented testimonials; no CF dollar amounts; no flooded-house disaster imagery; never show or suggest removing a pump’s float.

---

## 7. Public CTA

Primary: **Join the beta** / interest list.

Suggested line:  
*We’re looking for homeowners to test Basement Guard Pro in their own basements before launch.*

Secondary (optional): watch the demo (scroll to in-site demo).

No App Store badges, no internal status, no engineering-gate or “shipping when X lands” language on the public page.

---

## 8. Hand-off checklist for ECC / Design

- [ ] Site shell uses this brief only (no private engineering or cost docs)
- [ ] In-site demo wired with the basement tiles and storm / stagger / cold-snap interactions above
- [ ] Basement visual direction — not pool, not reef reskin
- [ ] Fail-safe and stagger captions present; no copy suggests removing floats
- [ ] CTA = beta interest
- [ ] All concept art labelled **Concept**
- [ ] Prices absent until publicly announced

---

## 9. Hard don’ts (public copy)

- No cost, retail or package prices
- No pinouts, port names, board part numbers or bench/gate names
- No cloud Home Assistant (HA is home-network only; away alerts ride the phone/cloud path via Tailscale)
- No invented UL/safety listings, amp or horsepower ratings
- No sewage or commercial duplex claims; heat tape / dehumidifier = plug-in only
- No claim that we supply backup power — the inverter hook-up only switches on one the owner already has

---



*Marketing-safe public slice (scrubbed for the public repo, 2026-10-26).*
