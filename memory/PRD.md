# Beauty Am Schloss — Haute Parfumerie & Medical Skincare Maison

## Original Problem Statement
Originally LUXÉLLE; rebranded fully to **Beauty Am Schloss** with Parfum as the primary focus,
Doctor Babor & Mesoestetic moved to secondary skincare category. Refined palette, upgraded
typography, true luxury pricing, exclusive product names & descriptions, reviews & trust signals,
cart drawer, improved hero/footer/cards/mobile.

## Architecture
- Backend: FastAPI + MongoDB. Endpoints: `/api/brands?category=`, `/api/products?category=&filter=`, `/api/reviews`, `/api/newsletter`.
- Frontend: React (CRACO) + Tailwind. Fonts: Cormorant Garamond (display), Italiana (accents), Inter (body).
- Color palette: ivory `#f5f0e8`, espresso `#1c1714`, antique brass `#a8814a`, bordeaux `#5a1d24`.

## Implemented (Iter 2 — 2026-02)
- Full rebrand to Beauty Am Schloss (logo: "BEAUTY *am* SCHLOSS" with crest)
- Parfum-first content: 4 haute maisons (Boadicea, Fragrance Du Bois, Roja, Xerjoff) + 8 perfumes (€365–€920)
- Doctor Babor + Mesoestetic now secondary skincare section (4 products)
- New cinematic dark hero "Düfte, die Geschichte tragen." with marquee announcements
- Trust signals row including "Handcrafted in Europe / Authorised Maison Retailer"
- Upgraded product cards: tag, brand, star rating + review count, name, italic subtitle, fragrance notes, price, size, hover quick-add + inline add button
- Customer reviews section (3 testimonials, 4.9★ rating, 1.840 verified)
- Philosophy with Givenchy quote
- Cart drawer (Sheet) "Ihr Cabinet" with qty controls, free-shipping progress bar, checkout CTA
- Upgraded footer with Berlin/Charlottenburg address, concierge phone, social icons in framed buttons
- Italiana micro-typography (N°I … N°VII section numbering)
- Refined animations: smooth img-hover (1.6s ease), shimmer gold text, fade-up reveal

## Validated
- 100% backend pytest (11/11)
- 100% frontend e2e (cart, nav, scroll, newsletter, mobile menu, reviews)

## Backlog / Next Phase
- P1: Product detail pages with full description, ingredients, full reviews
- P1: Stripe checkout integration (cart -> payment)
- P1: LocalStorage persistence for cart
- P2: Per-Maison landing pages
- P2: Search overlay
- P2: Account / Google auth (Emergent)
- P2: Admin panel for product CRUD
- P3: i18n DE/EN toggle
- P3: Sample-gift selector at checkout
