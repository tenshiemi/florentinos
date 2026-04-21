# Florentino's Fine Flowers — Website Design Spec

**Date:** 2026-04-21
**Business:** Florentino's Fine Flowers, Madison Valley, Seattle
**Developer:** Emily Chen

---

## 1. Project Goals

Replace the existing florentinosseattle.com with a modern, dark/dramatic site that:
- Reflects the luxury, artistic brand identity (not "warm and fuzzy")
- Converts visitors into order inquiries and subscription sign-ups
- Lets Florentino update content himself (photos, text) without coding
- Drives foot traffic to the physical gift shop without diluting the flower brand
- Keeps ongoing costs minimal (target: ~$10–15/yr for domain only)

---

## 2. Technical Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Astro (static output) | Purpose-built for content sites, fast, supports React islands for interactive pieces |
| Hosting | Netlify (free tier) | Auto-deploys from git, built-in form handling, no server to maintain |
| CMS | Sanity (free tier, up to 3 users / 10GB) | Visual Studio editor — Florentino updates photos/text via browser dashboard; Netlify webhook triggers rebuild on save |
| Scroll/Animation | Lenis + GSAP ScrollTrigger | Smooth continuous scroll, section entrance animations |
| Forms | Netlify Forms (free, up to 100 submissions/mo total) | Inquiry submissions email directly to Florentino; no backend needed |
| Email Aliases | Cloudflare Email Routing (free) | Forwards ciao@florentinosseattle.com → Gmail/ProtonMail; replaces Dreamhost email |
| DNS | Cloudflare (free) | Sits in front of Netlify, handles email routing |
| Domain | Stay at Dreamhost or transfer to Namecheap (~$10–15/yr) | Keep registration separate from hosting |
| Payments | None on site | Florentino reviews all inquiries manually and invoices via his existing tools |

**Dreamhost:** Cancel hosting. Keep or transfer domain registration only.

---

## 3. Brand System

### Colors
| Name | Hex | Usage |
|---|---|---|
| Gold | `#FFE184` | Headings, labels, CTAs, accents |
| Navy | `#212745` | Primary dark background, nav |
| Blue | `#113366` | Secondary sections, hover states |
| Near-black | `#0a0a14` | Page background, hero |

### Typography
- **Cormorant Garamond** — headings, display text, brand name (elegant serif)
- **Raleway** — body copy, UI labels, form fields (geometric sans)
- Note: Confirm with Florentino whether the brand board fonts are licensed; Google Fonts versions are the fallback.

### Accessibility (WCAG AA)
All form UI meets the following minimums:
- Placeholder text: `#8888aa` (~5:1 contrast)
- Helper/hint text: `#9999bb` (~4.5:1 contrast)
- Input borders: `#4a4a6e`, 1.5px
- Labels: 12px, `#FFE184`
- Input/placeholder font size: 14px
- Disclaimer text: 13px
- Focus rings: `#FFE184` 2px outline

---

## 4. Site Structure

| Page | Purpose |
|---|---|
| **Home** | Brand introduction, smooth-scroll showcase, links to all key actions |
| **Gallery** | Full flower portfolio with dark-treated photos |
| **Order** | Custom arrangement inquiry form |
| **Subscribe** | Flower subscription inquiry form |
| **About** | Florentino's story, the shop, his craft |
| **Visit** | Hours, address, Google Maps embed, gift shop teaser, contact |

Gifts do not have a dedicated page. They are surfaced on the Visit page as a reason to come in — positioned as an in-person discovery experience, not an online purchase.

---

## 5. Homepage Layout

Six full-viewport sections, continuous smooth scroll (no snap). Elements fade/slide in via GSAP ScrollTrigger as each section enters the viewport.

1. **Hero** — Full-viewport, near-black background, parallax flower image, brand name + tagline, single CTA ("Order an Arrangement"), scroll indicator
2. **Gallery Preview** — 4 featured arrangement photos, dark-background treated, staggered entrance animation, CTA to Gallery page
3. **Custom Order Teaser** — Brand statement ("Every arrangement, made for you"), brief description of the inquiry process, CTA to Order page
4. **Subscription Teaser** — ("Fresh flowers, on your schedule"), frequency options teaser, gold CTA to Subscribe page
5. **About Teaser** — Brief story, photo of Florentino or the shop, link to About page
6. **Visit Preview** — Address, hours summary, hint at the gift shop ("Come see what else we have"), link to Visit page

**Navigation:** Minimal top bar (logo left, page links right). Transparent over hero, fades to solid navy after scrolling past. Mobile: hamburger menu. Gold text throughout.

---

## 6. Photo Treatment

**Strategy:** Hybrid approach — the dark navy site design does most of the heavy lifting naturally.

- **Hero / background images:** CSS dark gradient overlay on existing photos. Zero photo editing required.
- **Gallery showcase photos:** AI background removal (Remove.bg, Adobe Firefly, or Photoshop AI) for the most impactful arrangement shots. Flowers placed on dark/navy canvas with subtle glow.
- **Future photos:** Florentino should shoot new arrangements against dark backgrounds for best results.
- **Existing photos with cluttered backgrounds:** Use CSS overlay; flag the weakest ones for re-shooting.

---

## 7. Order Inquiry Form

Hosted on the `/order` page. Submitted via Netlify Forms — Florentino receives an email notification, reviews the inquiry, and follows up with a custom quote and invoice.

**Fields (in order):**
1. Date Needed (date input)
2. Delivery or Pickup (toggle/radio)
3. Recipient Name
4. Delivery Address (shown conditionally if Delivery selected)
5. Card Message (textarea)
6. Order Request — "Describe the vibe, colors, or feeling — we'll handle the rest." (textarea, intentionally vague)
7. Budget (dropdown: $75, $100, $125 … $400, $400+, in $25 increments)
8. Purchaser Name
9. Purchaser Email
10. Purchaser Phone
11. Today's Date (date input)
12. Disclaimer: "By submitting this form you understand that this is an inquiry, not a confirmed order. Florentino's will follow up with a custom quote and invoice for your approval."
13. Submit button: "Send Inquiry"

---

## 8. Subscription Inquiry Form

Hosted on the `/subscribe` page. Same Netlify Forms handling — Florentino confirms details and invoices manually on a recurring basis.

**Fields (in order):**
1. Purchaser Name
2. Purchaser Email
3. Purchaser Phone
4. Delivery or Pickup (toggle/radio)
5. Frequency: Weekly / Every 2 Weeks / Monthly (pill buttons)
6. Recipient Name (if different)
7. Delivery Address (shown conditionally if Delivery selected)
8. Preferred Start Date (date input)
9. Special Requests — "Colors, styles, anything to avoid — we'll take it from there." (textarea)
10. Budget Per Arrangement (same $25-increment dropdown, starting at $75)
11. Style Preferences — "Modern, lush, wild, minimal, seasonal — or let us surprise you." (textarea)
12. Disclaimer: "By submitting you understand this is an inquiry. We'll follow up to confirm your subscription details and first invoice."
13. Submit button: "Start My Subscription"

---

## 9. CMS Content Model (Sanity)

Florentino manages the following content types via Sanity Studio:

| Content Type | Fields |
|---|---|
| **Gallery Image** | Photo, caption (optional), display order |
| **Homepage Featured** | Which gallery images appear in the hero preview (max 4) |
| **About** | Bio text, photo |
| **Visit** | Address, hours (structured), Google Maps URL |
| **Site Settings** | Business name, phone, email, social links |

All other content (page copy, form fields) is managed in code by Emily.

---

## 10. Open Questions for Florentino

- [ ] Does he want the About page to include a photo of himself, the shop interior, or both?
- [ ] Does he want a Weddings/Events section anywhere, or is the inquiry form sufficient?
- [ ] What are his delivery boundaries (Seattle only? Eastside?)
- [ ] What are his current hours?
- [ ] Does he have existing photos ready, or do we start with a minimal gallery and add over time?
- [ ] Which font from the brand board is licensed, if any?
