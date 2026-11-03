# Gradient data-safety verification — 3 November 2026

This focused follow-up addresses restore recovery and emergency exports against commit `4012bc6`. It does not implement every product suggestion or certify the entire application.

## Changes

- Ordinary repository and project reads/saves no longer replay a restore undo journal. A stale journal must not silently replace imported records with an older copy. These paths stop without changing the records or journal.
- Emergency exports acquire the same account-scoped native Web Lock as saves and imports. The snapshot uses the previously verified identity without switching the active account and includes the preserved original records when an import was interrupted.
- The existing recovery screen now offers a usable recovery path: download the saved copy, then choose the existing **Try again** button. Its existing status text explains that this restores the original records from before the interrupted import. Recovery checks the active identity and exact downloaded journal under the lock. A changed or absent journal causes a fresh reload rather than replaying an outdated recovery copy.
- When the server confirms accounts are unconfigured, a fresh tab can identify its local-only recovery copy from validated legacy records. Account-scoped records are excluded.
- No styles, layouts, icons, animations, normal page content, routes, or lesson material were changed. Existing recovery status/error messages explain the new behavior; no visible components were added.

## Verification

- `npm test`: **136 tests passed across 20 files**.
- `npx tsc --noEmit --incremental false`: passed.
- Isolated `npm run build`: passed, including framework lint/type validation and generation of 28 static pages. The workspace development cache was not rebuilt.
- Six new regressions were observed failing before implementation and passing afterward: ordinary profile/project access preserves pending restore records; export waits for the verified account lock; unsupported coordination stops before reading; explicit recovery rejects changed journals/foreign accounts; fresh-tab local identity uses only validated legacy records.
- Real isolated desktop browser: second-tab startup preserved imported bytes and the journal; backup download waited behind an actual native Web Lock and exported the original copy without storage writes.
- Real isolated desktop/mobile recovery: authenticated desktop and fresh-tab local mobile both downloaded the original copy and successfully reopened after explicit recovery. Retry before download preserved storage. Foreign-account records stayed byte-identical. No page errors or horizontal overflow were observed.
- Isolated mobile smoke check: multiline note autosave survived reload and browser Back retained the course query/filter.
- TypeScript AST comparison against HEAD: returned JSX structure and literal text in AccountProvider and RecoveryExport remained identical after excluding event-handler attributes. This is source-level evidence, not a full pixel-comparison certification.
- Independent read-only review identified two recovery-access problems during implementation; both were resolved. The final review reported no remaining concrete data-safety blockers.

All browser study checks used synthetic local records and mocked account GET responses in isolated contexts. No real student data was edited, and live authentication was not revalidated.

## Limits and next work

- Browsers without Web Locks cannot use the coordinated restore/emergency-export path. The operation stops rather than presenting an uncoordinated snapshot as safe.
- A browser can report that a download started; the website cannot prove the user kept the file on disk.
- Clearing browser storage, disk failures, and older already-open application versions that do not honor the shared lock remain outside these guarantees. This is not a claim that student data can never be lost.
- Malformed recovery records are preserved and rejected; they may require manual repair. Persistent quota/write failures retain the journal for another attempt.
- No complete latest screenshot matrix, Lighthouse measurement, assistive-technology audit, or cross-browser certification was performed in this focused pass.
- Loader reduced-motion behavior, additional subject depth, feedback delivery, and optional cloud backup remain separate follow-up work. The current design is retained.

## Delivery status

These follow-up changes are local and uncommitted. No push or deployment was performed. The production deployment inspected before this implementation was READY at `4012bc6`; it does not include this follow-up patch.
