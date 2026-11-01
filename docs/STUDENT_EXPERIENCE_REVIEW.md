# Student experience redesign — implementation and verification

## Original problems
Home repeated the lesson workspace, combining metrics, timer tools, study guidance, task checklists, reviews and milestones. Desktop and mobile used different navigation categories. Lesson resources appeared twice. Completion did not provide a direct next-lesson action. Progress described estimated work as logged time and self-rated concepts as mastered.

## Changes and decisions
- Home now provides one prominent Start/Continue action, the next unfinished required activity, saved lesson progress, and a small upcoming preview. New learners get a three-step explanation; returning learners see their current work. Maintenance, missing position, storage failure and full completion have separate recovery/next actions.
- Home / Learn / Progress / Career are shared desktop and mobile destinations. Settings lives under profile; contextual links preserve access to courses, roadmap, resources, projects, review, internships, placements and application tracking. Existing URLs remain valid.
- Lesson work stays inside the lesson. Resources are shown once; proof criteria, support and timer tools use disclosure. Lesson 1 includes a working illustrative C++ example. The first five lesson titles now use approachable wording; lesson IDs, exercise content, goals and persistence keys remain unchanged.
- Completion offers a direct next lesson or readiness-check action. Future lessons clearly identify themselves as previews. Existing sequence and maintenance validation remains authoritative.
- Progress uses real completion records, estimated curriculum duration, self-rated recall and saved applications. It includes links back to completed work.
- Existing warm neutral brand colors, dark theme, account flow, account-scoped storage, JSON backups, evidence, projects, curriculum and reviews were retained. No services or dependencies were added.

## References consulted
- [freeCodeCamp open-source curriculum](https://github.com/freeCodeCamp/freeCodeCamp): sequence-oriented curriculum and practical learning.
- [CS50 Week 0](https://cs50.harvard.edu/x/weeks/0/): distinct lecture, notes, example and practice resources, including official YouTube links.
- [CS50 introduction on YouTube](https://www.youtube.com/watch?v=OvKCESUCWII): beginner course reference found through search. Video playback was not used as verification.

## Verification results
- `npm test -- --reporter=dot`: **46 tests passed across 7 suites**. Seven new Home resolver tests cover fresh/resumed activity, later saved positions, maintenance, full completion, invalid sequence and unknown completion IDs.
- `npx tsc --noEmit`: passed.
- Production `next build`: passed, including static generation and type validation. Built from an isolated temporary source copy sharing installed dependencies so the running development server was not interrupted. No deployment was performed.
- `git diff --check`: passed.
- Independent code review reported no actionable findings.

Actual Playwright browser checks in isolated browser contexts, with only the account-session response mocked and real application rendering/repository/local storage:
- Fresh Home and selecting the SQL outline.
- Incomplete required work blocks completion.
- Saving task evidence, leaving a lesson and resuming saved activity.
- Completing lesson 1, opening lesson 2 and seeing the updated Home count.
- Switching to the DSA outline preserves C++ completion and task evidence.
- Mobile Home / Learn / roadmap / Career / Progress navigation.
- Maintenance pauses the required-lesson action.
- Missing/inconsistent completion data offers recovery rather than a false completion celebration.
- Completed foundation offers the readiness check.
- Unknown lesson provides a return link.
- Home storage failures display a retry state; retry recovers when storage becomes available.
- Preview lessons cannot advance the current sequence.
- Keyboard search opens and dismisses; focusing the skip link and pressing Enter moves focus to main content.
- Mobile Home and lesson screens fit at 390px; completed-state layout also checked at 360, 768 and 1440px.
- Existing dark-theme toggle renders the redesigned Home.

Successful full-journey and state runs recorded no JavaScript page errors. Initial automation attempts were corrected to wait for lesson data before enumerating tasks and to use Learn navigation when the side card displays recall instead of course exploration. These were test assumptions, not changes to completion rules.

## Limits
Live account creation/sign-in was not re-tested against the backend; browser verification used a mocked isolated account identity and did not alter the user's browser data. Only C++ currently has tracked guided lessons; other subjects remain self-directed outlines. Browsing another subject does not change or erase the guided C++ sequence. Progress remains on the device, transferable through existing JSON backups. The new examples and recall explanations supplement existing external learning resources; this change does not author complete textbook lessons for every topic or introduce automatic code grading. A full formal accessibility audit and real-student usability study remain future work.
