# Product rules

## Status and authority

This is the authoritative product specification. [AGENTS.md](AGENTS.md) defines the mandatory workflow. Requirements below are settled unless explicitly labelled proposed or unresolved. Open questions must remain open until agreed with the user; they must not become implicit implementation defaults.

The user has selected Expo and explicitly authorized its default project scaffold and setup checks. Settled requirements and roadmap features do not authorize product implementation. Collaboratively write the precise first use case and then its tests before implementation, and repeat use-case-first and test-first collaboration for every behavior change.

## Product and architecture

- Build a mobile learning experience with a fresh, original UI.
- Use domain-driven design, reusable application use cases and explicit interfaces with dependency inversion. Domain/application rules must not depend on UI frameworks or infrastructure providers.
- Reuse the learning model across curricula and themes; do not hard-code Azure-specific behavior into the shared learning rules.
- Initial curriculum: AI-200, available in English and French.
- Additional curriculum scope: culture générale and French lycée seconde, première, and terminale. Their precise subject coverage, sequencing, and launch schedule remain unresolved.

## AI-200 curriculum authority

Use the [official Microsoft AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200) as the curriculum reference. Verified on 2026-11-22; the page states last updated 2026-10-30. Its four domains are:

| Domain | Exam weighting |
| --- | --- |
| Develop containerized solutions on Azure | 20–25% |
| Develop AI solutions by using Azure data management services | 25–30% |
| Connect to and consume Azure services | 20–25% |
| Secure, monitor, and troubleshoot Azure solutions | 20–25% |

These describe curriculum coverage, not an invented mastery scoring formula. The guide explicitly includes building and managing images and running Tasks in Azure Container Registry, supporting the proposed first slice.

## Learner experience

- Provide login, an avatar, XP, and visible mastery progress.
- Let learners select a learning track.
- Offer daily study goals of 5, 15, or 30 minutes.
- Daily push reminders are opt-in, at a time chosen by the learner. Remaining scheduling details and permission-denial behavior require agreement. A notification or app launch alone does not constitute studying.
- Completing a lesson or review qualifies for a streak. Time-zone/day boundaries and interruption rules require agreement.
- Keep XP and mastery distinct: XP supports cosmetic rewards; mastery governs progression. Their formulas remain unresolved.
- Preserve accessibility in the original UI; detailed design and interaction choices require collaboration.

## Lessons and languages

- Every lesson is strictly under 250 words in each localization.
- English and French localizations share the same stable lesson/content identity, so changing language does not create a separate learning record.
- Both initial languages must be supported; precise translation, fallback, and word-count conventions remain unresolved.
- Lessons must be reusable within curricula/themes while retaining their identity and source information.

## Practice and review

- Quizzes provide immediate explanations.
- After three mistakes, require rereading the lesson before retrying. Retrying is free. The mistake-count scope and how rereading is recognized remain unresolved.
- Occasionally offer flashcards with four answer choices. They award XP and are exempt from the dedicated review limit. Timing, frequency, and XP amounts remain unresolved.
- Free learners receive three dedicated review sessions per day. Define what counts as one dedicated review session and the daily reset before implementation.
- Do not conflate free quiz retries or occasional flashcards with the limited dedicated review activity.

## Progression and payment

- The first 25% of the curriculum is initially available for free. Mastering each available quarter unlocks the next quarter for free: 25% → 50% → 75% → 100% access. Exact mastery criteria remain unresolved.
- A full free learning path must remain available through mastery progression; payment cannot be required to finish the curriculum.
- Payment grants immediate full access and unlimited dedicated reviews. Payment confirmation, entitlement scope, duration, restoration, and offline behavior require agreement before implementation.
- XP rewards are cosmetic. Do not substitute XP spending or an unagreed XP threshold for the mastery-based free path.
- Provide an app-issued mastery badge for LinkedIn. It must be presented as the application's badge, with no claim of Microsoft certification. Award criteria and sharing mechanics remain unresolved.

## Offline study and synchronization

- After sign-in, learners can study offline using current downloaded content. Do not assume that undownloaded lessons are available offline.
- Synchronize offline learning when connectivity returns, preserving learner progress.
- Synchronization must be idempotent: replaying or retrying the same operation cannot duplicate progress, XP, or dedicated review consumption.
- The first slice must include offline study and synchronization, not postpone them as optional enhancements.
- Collaboratively define observable behavior for interrupted downloads, interrupted sync, retries, content revisions, account boundaries, conflicting devices, and offline review limits before implementing affected behavior. No merge strategy, quota authority, or offline entitlement policy is selected yet.

## Source freshness and Azure costs

- Verify learning sources weekly against official references.
- Show content version, verification date, and official source links on-device, including for downloaded study content. A content version and a verification date are separate facts.
- Do not imply a successful verification when a check failed. Publication, stale-content handling, and verification ownership must be agreed before implementation.
- When presenting real Azure costs, use regional pricing and currency configuration, include the pricing date, and link the official pricing source. Do not present an undated global price as a current regional cost.
- Pricing lookup/provider, refresh mechanics, regions, currency defaults, assumptions, and any resource-provisioning scope remain unresolved. This requirement does not authorize provisioning paid Azure resources.

## Proposed first slice — not an agreed use case

A bilingual English/French Azure Container Registry learning slice, within the containerized solutions domain, exercising the reusable learning model, offline study of downloaded content after sign-in, and idempotent synchronization.

The exact actor journey, lesson boundaries, starting state, quiz/review inclusion, success outcome, alternate paths, and test cases must be written with the user. This proposal intentionally supplies neither a completed use case nor invented acceptance tests. Do not implement it until the AGENTS.md collaboration and test-first gates are satisfied.

## Unresolved decisions register

These questions are separate from the settled rules above. Resolve only what the next agreed use case needs, with the user:

- **Technology:** Expo is selected for the mobile scaffold. Mobile platforms, distribution, backend, persistence, sync transport, test tools, hosting, and remaining stack choices are unresolved.
- **Identity:** authentication provider/methods, account lifecycle, offline sign-in/session validity, and account-switch behavior.
- **Commercial terms:** billing provider, price, purchase model, entitlement duration/scope, confirmation, restoration, refunds, and regional billing rules.
- **Learning model:** exact mastery criteria and calculation/evidence, quiz structure, mistake-count scope, reread completion, review session definition and daily reset.
- **Rewards:** XP amounts and thresholds, cosmetic catalog, flashcard cadence, badge award and LinkedIn sharing mechanics.
- **Habits:** goal completion measurement, time zone/day boundaries, streak interruption rules, remaining reminder scheduling details, and permission-denial experience.
- **Content:** exact first use case and tests, ACR lesson coverage, localization process/fallback, word counting, curriculum/theme taxonomy, and later curriculum sequencing.
- **Offline consistency:** download lifecycle, content-version migration, conflict resolution, multi-device reconciliation, daily quota enforcement, pending writes, and offline paid access.
- **Operations and design:** weekly verification process and failure policy, Azure price configuration, privacy/security details, accessibility targets, and original visual direction.

Resolve and document decisions explicitly; do not infer answers from a framework convention, this proposal, or the presence of a requirement.
