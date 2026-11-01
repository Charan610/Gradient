# Gradient: premium student experience

## Strategy

Give each learner a calm next step, then reveal the larger learning system when it is useful. Use an editorial ivory-and-terracotta identity, precise controls, comfortable reading, and real saved progress. Preserve authentication, account-scoped browser storage, backup formats, curriculum order, completion requirements, and the recall scheduler.

## Reference research and boundaries

Public pages were inspected in an isolated browser at desktop and mobile sizes, including secondary product pages, screenshots, text, controls, and selected computed transitions. No access controls were bypassed, accounts created, or paid/native products accessed. Observations below concern the public experiences, not authenticated dashboards.

| Reference | Observed | Selected for Gradient |
| --- | --- | --- |
| [Craft](https://www.craft.do/plan) | Editorial serif hierarchy, generous spacing, layered document and task examples on its planning page. These were public product demonstrations, not an editable account. | Serif display titles, layered example card, document-like lesson surfaces; retain compact sans-serif controls. |
| [Brilliant](https://brilliant.org/) | Current public experience introduces Koji. The learner CTA opens onboarding; Continue progresses to a Math / Computer Science & Coding choice. | A small prediction exercise before commitment, immediate explanatory feedback, optional preferences progressively disclosed. No claim to reproduce its tutoring system. |
| [Linear](https://linear.app/docs) | Compact docs navigation, expandable Getting Started group, searchable structure; short control transitions around 160ms. | Four primary destinations, contextual secondary links, keyboard search, brief state transitions. Avoid its dark marketing aesthetic and blur entrances. |
| [Readwise Reader](https://readwise.io/read) | Public reading-product previews, reading/highlight workflow descriptions, expandable device FAQ. Actual signed-in library was inaccessible without authentication. | Comfortable reading measure, quieter supporting material, native expandable resources and explanations. This is a design interpretation of public previews, not a verified private reading workflow. |
| [Codecademy](https://www.codecademy.com/catalog/language/c-plus-plus) | C++ catalog presents course format, beginner level, duration, and filters. A custom-checkbox automation attempt did not succeed, so filter behavior is not claimed as tested. | Explicit guided-course versus outline labels, course previews, prerequisites, search, and clear lesson continuation. Avoid catalog marketing density. |
| [Things](https://culturedcode.com/things/support/articles/6378414/) | Public guide separates Inbox, Today, Upcoming, Anytime, Someday, and projects; native UI illustrated on its site. Native app was not used. | Home prioritizes the current lesson and next activity. Broader roadmap and career resources stay available elsewhere. Do not introduce calendar debt into a learning-day system. |

The six references fit distinct needs, but use one shared Gradient palette and hierarchy. Proprietary graphics and full interfaces were not copied.

## Audit findings and changes

- Beginners previously faced dense task-management language, scattered destinations, and mixed visual styles. Home now offers a clear starting or continuing lesson, required-task progress, a short learning rhythm or upcoming lessons, and a secondary recall/exploration action.
- The unsolicited landing signup dialog interrupted exploration. Entry is now deliberate, with a direct workspace link for returning/password-free users and a separate signup path.
- Landing now demonstrates a real interactive prediction instead of promising an automated tutor or code judge. Its shelf states which tracks are outlines.
- Signup/signin use a reusable two-column welcome frame. Semester/session preferences are optional disclosure. Existing schemas, requests, and storage remain intact.
- Library removes layered legacy dark/metal overrides in favor of warm book-like covers, a sage foundation panel, consistent metadata, search, and filters.
- First lesson reuses the accessible prediction component. Learning guides retain exercises, assigned resources, self-checks, evidence, optional timer/recall, and completion rules. Completion exposes the next lesson.
- Progress and Career keep their focused structures and receive the shared visual treatment. Career subpages have quieter titles; official portal links are not described as live-verified listings.
- Roadmap reads saved readiness attempts rather than always showing an empty pass history, and labels guided versus outline phases.
- Recall has explicit loading/error states and prevents concurrent rating writes. Failed writes leave the rating controls available with accurate retry instructions.
- No packages were added. No production deployment or database mutation was performed.

## Visual and interaction system

- Canvas `#FAF7F0`, warm surface `#EAE4D9`, ink `#292723`.
- Decorative terracotta `#C66C50`; darker actionable terracotta `#A54C35` for white-button/text contrast; sage text `#657354` on pale sage panels.
- System serif display stack and existing system sans-serif reading/control stack; no remote font request.
- Fine borders, restrained layered shadows, simple original ascending-bar brand mark.
- Short opacity/transform feedback, modest hover movement, task check feedback, native disclosures, and existing reduced-motion support. No blanket animation library or layout-heavy motion.
- Visible keyboard focus, native radio controls and fieldsets, live feedback, 44px primary/secondary controls, responsive grids. This is targeted accessibility verification, not a full WCAG certification.

## Verification

- Existing suite: 46 tests across seven files passed.
- TypeScript passed. Optimized Next.js production build passed; build runs in an isolated source copy to avoid disrupting localhost development.
- Desktop walkthrough: landing, signup, Home, library, first lesson, progress, Career, recall, roadmap; no page errors observed.
- Beginner browser journey used account service unavailable mode: created only an isolated browser-local profile, changed session budget, started first lesson, checked incomplete-submission validation, saved evidence, completed four activities, completed lesson one, opened lesson two, and reloaded Home with 1/30 complete. Evidence persisted on returning to lesson one.
- Recall reveal/rating saved. Injected review-storage write failure showed retry guidance; restoring storage and selecting the rating again saved exactly one interval advancement.
- Direct landing workspace link resumes an existing session. Prediction answer selection and correct-answer feedback tested.
- Mobile route checks at 390px: landing, signup, Home, course library, SQL outline, lesson journey, progress, career hub, recall, roadmap, projects, settings. Real career subroutes and resources additionally checked at 360/390/768px.
- Found and fixed narrow signup headline overflow and rotated landing decoration overflow. Both rechecked at 360px; landing also rechecked at 390px.
- Keyboard search opens with Ctrl+K and dismisses with Escape; focusing/activating skip link moves focus to MAIN. Dark Home inspected. Reduced-motion main animation resolves to 0.00001s.
- All account-backed UI tests used isolated contexts with account GET mocked. Live backend signup/password/session persistence were not re-tested; no real learner data was changed.

## Remaining opportunities

C++ remains the only 30-lesson guided course; other tracks are outlines. Code execution/grading and automatic progress sync remain unavailable and are disclosed. Account authentication and local progress storage remain separate concerns. A useful next research step is usability sessions with first-time students, especially around compiler setup and self-assessment; browser checks cannot establish learning effectiveness. A full assistive-technology audit and backend integration testing would extend the targeted checks here.
