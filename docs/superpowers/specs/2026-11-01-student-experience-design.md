# Student experience redesign

User authorized autonomous decisions and implementation in the existing Next.js/SCSS application.

## Audit
Home currently renders metrics, a lesson hero, an interactive studio, study guide, editable task list, journey cards, reviews and gates together. It duplicates the lesson page and offers competing entry points. Desktop navigation has nine primary destinations while mobile has a different grouping. Learning resources repeat on the lesson page. Completion lacks a direct next-lesson action. Insights incorrectly describes estimated curriculum effort as logged work and self-rated recall as mastery. Accounts are implemented through the account API and Supabase-backed gateway. The account provider gates workspace access and initializes account-scoped browser storage; study records remain local with JSON transfer. Preserve these boundaries.

## Decision
Use Home / Learn / Progress / Career as primary destinations. Put Settings in profile. Contextual links expose roadmaps, resources, projects, reviews, placements, internships and applications. Keep all existing URLs.
Home is a resume screen: greeting, one current lesson action, exact first incomplete required activity, small progress bar, next lessons, optional recall. First-time students receive a short explanation and path choice link; experienced students can browse outlines without resetting guided work. Completion and maintenance have explicit alternate actions. No inferred skill level or calendar penalties.
Lesson is the work screen. Keep original task evidence, independent completion validation, review scheduling and course content. Supplementary resources and proof criteria use details disclosure. Add completion-to-next-lesson affordance, preview labeling and error recovery. Do not introduce fabricated code grading.

## Alternatives
A cosmetic dashboard refresh would preserve overload. A complete new LMS would risk data compatibility. Selected: focused navigation and journey restructuring on existing storage and components, without new dependencies.

## References
- https://github.com/freeCodeCamp/freeCodeCamp — sequential curriculum and practice-oriented learning.
- https://cs50.harvard.edu/x/weeks/0/ — lecture, notes, examples and practice as distinct resources, with official YouTube links.
- https://www.youtube.com/watch?v=OvKCESUCWII — beginner-oriented CS50 introduction (reference listing; no claim of watching the video).

## Validation
Unit-test home state using real lesson and saved task shapes: new, resumed, finished, maintenance, missing sequence and inconsistent completion. Run regression tests, TypeScript and production build. Browser-check clean and resumed journeys, completion blocking and next action, mobile overflow, keyboard, navigation and error paths in isolated test storage.
