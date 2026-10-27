# Interaction and usability checklist

This app is a local-first Next.js study workspace. Features are applied to real flows rather than adding account or image features solely to demonstrate UI patterns.

| Requested pattern | Current treatment |
| --- | --- |
| Skeleton loaders | Route-level workspace skeleton and Today progress skeleton; accessible loading announcement and reduced-motion fallback. |
| Optimistic updates | Task status changes immediately, blocks conflicting submissions during save, and rolls back with a visible error on failure. |
| Command menu | Workspace-wide search, arrow navigation, Enter selection, Escape/backdrop/close button dismissal, focus restoration. |
| Shortcut hints | Ctrl/Command+K on the search trigger and keyboard shortcuts in the menu footer. |
| Undo toasts | Task changes offer persistent, dismissible Undo; no expiry pressure. Undo preserves evidence, cannot reverse a finished day, and checks for later changes in another window. |
| Stale-while-revalidate | Course progress is cached across navigation and refreshed on mount, focus, visibility, local progress events, and other-tab storage changes. Concurrent reads deduplicate. Stale records remain available after failures. This is local data refresh, not remote cloud sync. |
| Pre-rendering | Next.js build pre-renders static routes; personal data hydrates from browser storage. Dynamic detail routes keep their existing server rendering. |
| BlurHash placeholders | Not applicable: the current interface uses CSS and SVG artwork, not loaded photographic assets. No fake blurred image placeholders. |
| View transitions | Study Studio tabs use the browser API when supported, with immediate fallback and reduced-motion handling. |
| Swipe-to-dismiss sheets | Mobile command menu becomes a bottom sheet; downward drag on the handle dismisses it. Close button remains available. |
| Interruptible animations | New Studio transitions skip the previous animation; controls remain actionable. Pointer lighting is animation-frame scheduled and motion-aware. |
| Predictive back | Keep native browser history and edge-back gestures. No custom edge-swipe interception or fake OS predictive-back animation. |
| Hit slop | Expanded checkbox hit area and 44px search/close/undo controls. |
| Safe area insets | Viewport-fit cover, safe-area-aware top header, bottom navigation, sheet, and toast positioning. |
| One-time code autofill | Not applicable: there is no OTP authentication form. Do not introduce a login just to demonstrate autofill. |
| Tabular numbers | Timer, metrics, progress and keyboard hints use tabular figures. |
| Balanced headlines | Global heading text-wrap: balance with browser fallback. |
| Continuous corners | Progressive superellipse corners for buttons and dialogs; rounded corners remain in unsupported browsers. |
| Idempotency keys | Local completion uses stable user/day identity to deduplicate concurrent calls and persisted completion for later retries. This is not an HTTP idempotency-key implementation; there is no remote completion endpoint in the active local flow. |
| Amazon safe triangle | Not applicable: no cascading hover submenus exist. Navigation is click/tap-based, avoiding pointer-path menu switching. |

## Verification

- 33 regression tests: includes cache deduplication, stale-data retention/recovery, subscriber cleanup, and concurrent completion deduplication.
- Production build succeeds and pre-renders static routes.
- Browser-tested successful task save, Undo, injected storage-failure rollback, visible save errors, command-menu keyboard focus restoration, Studio tab switching, cross-tab storage refresh, and mobile sheet drag dismissal.
- Existing colors and reduced-motion preferences are preserved.

## Browser feature references

- [MDN: startViewTransition](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition)
- [MDN: corner-shape](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape)
