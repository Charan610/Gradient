# Phase 3 polish implementation plan

Goal: finish the approved final phase and give the UI a visibly fresh treatment using the installed design skill, within the user's 15-minute target.

Architecture: retain Next/React/Sass and all local progress/account contracts. Independent workers own landing, SEO/privacy assets, and keyboard/accessibility components. Coordinator owns shared typography/tokens and workspace styling, integration and verification. No schema changes or new runtime dependencies.

Design: one locally served Manrope typeface, no italics, scale-based typography/spacing, flat surfaces, terracotta accents, neutral dark palette, compact floating public navigation. Keep honest guided/outline labels and calm pacing. Existing icon vocabulary retained in supporting tools to avoid an unnecessary dependency migration; newly drawn brand marks are SVG. No fake social proof or calendar pressure.

- [x] Redesign public landing and consistent final CTA; keep working prediction demo.
- [x] Add accurate SEO/social cards, branded favicon/404, sitemap/robots and privacy/terms.
- [x] Fix keyboard focus, prediction feedback, theme storage errors, touch targets and reduced motion.
- [x] Apply shared local font and restrained workspace visual updates without changing persistence.
- [x] Run all tests, TypeScript and isolated production build; browser journey including notes/backup restore; mobile/desktop light/dark axe and Lighthouse.
- [x] Capture before/after, document remaining limits, create reviewable commits and leave localhost running.

See docs/PHASE3_DELIVERY.md for verification methods and explicit limits.
