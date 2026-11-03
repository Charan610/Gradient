# Scroll text effects — 3 November 2026

- Homepage section headings reveal once with a short fade and 12px rise. The existing two-line statement reveals words in reading order; its text, colors, typography, line breaks, and wrapping are preserved.
- Workspace page headings use the same subtle effect. Paragraphs, code, inputs, error messages, dialogs, and the initial viewport are left still.
- Native smooth anchor scrolling is retained with 24px scroll padding. Wheel/touch scrolling is not intercepted and no scrolling dependency was installed.
- IntersectionObserver triggers effects; there is no continuous scroll loop. Mutation scans are batched and observers/listeners/animations are cleaned up on unmount.
- Base text is always visible. Missing JavaScript or animation APIs leave readable text. Reduced motion cancels effects immediately. Keyboard focus and anchor jumps suppress queued reveals until intentional scrolling resumes.

Verification: 218 tests passed across 26 files; TypeScript and the isolated production build passed. Nine motion regressions cover one-shot behavior, initial visibility, reduced motion, cleanup, stagger fill, keyboard focus, hash targets, and unsupported observers. Real desktop/mobile checks confirmed one reveal per heading, 10 word reveals, no overflow/errors, no active animations after reduced motion, and readable no-JavaScript text. Final mobile checks confirmed steady anchor/focus targets, resumed word effects on intentional scroll, workspace heading reveals, and byte-identical stored study data.

Delivery branch: `codex/gradient-followup`. Automatic Vercel deployments are disabled for this branch. Publishing the changes does not merge them into `main` or deploy the application. The development preview runs at `http://localhost:3000/`.
