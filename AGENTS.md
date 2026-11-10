# Project rules
- Use global font tokens for every text family; keep the supplied brand lettering as an image to preserve its identity.
- Keep a single cart presentation in Panier, rendered as a compact overlay by PublicStore; cart navigation carries the background location and return scroll so closing restores the originating page.
- Keep canonical catalog items unique and use category membership for overlapping themes; this prevents duplicated products with different category names.
- Reuse CollectionSections for ranges, duos and accessories on both store pages; duo prices are the sum of existing product prices, not invented promotional prices. There is no customer-composed duo.
- Section titles go through SectionHeading and inner-page headers through PageHero; the accessory set details stay fully visible, never collapsed.
- Centralize add-to-cart feedback in CartProvider and persist the first-add flag separately from cart contents; removing items must not replay onboarding.
- Use the shared product-grid and ProductCard for catalog layouts; consistent tracks keep small categories compact without stretching items.
- Keep each range expansion in its own card with start-aligned grid tracks; expanding one range must not stretch sibling cards.