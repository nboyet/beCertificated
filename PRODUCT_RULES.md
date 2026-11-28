# Product rules

## Status and authority

This is the authoritative product specification. [AGENTS.md](AGENTS.md) defines the mandatory workflow. Requirements below are settled unless explicitly labelled proposed or unresolved. Open questions must remain open until agreed with the user; they must not become implicit implementation defaults.

The user has selected Expo and explicitly authorized its default project scaffold and setup checks. Settled requirements and roadmap features do not authorize product implementation. Collaboratively write the precise first use case and then its tests before implementation, and repeat use-case-first and test-first collaboration for every behavior change.

## Agreed personal-release scope

This scope supersedes earlier launch sequencing and access assumptions below. Earlier bilingual application contracts remain valid and implemented; they do not require bilingual UI, accounts, synchronization, payment, or restricted access in this personal release.

- Serve one local learner without an account. UI and initial published teaching content are French only. All published lessons are accessible; no quarter unlock or payment gate applies.
- First deliver one real, static Azure Container Registry lesson explaining container images and tags. Download remains explicit and opt-in through the course download action; do not preload lesson content into local downloads.
- Retain the existing downloaded-lesson and course-save application contracts, including stable identity, source metadata, selected-locale storage, partial-save recovery, and offline opening. Their bilingual tests and synthetic 25% access examples remain regression contracts, not personal-release access policy.
- Next collaborate on local progress, lesson quizzes, hands-on practice, and a timed mock exam covering the official AI-200 objectives. These are preparation goals, not authorization to invent completion rules, quiz formats, scoring, timing, or Azure provisioning behavior.
- Accounts, synchronization, monetization, English UI/content, additional curricula, and other roadmap features below belong later. No account or synchronization dependency blocks this local personal release.

### First real French offline lesson — agreed use case and tests

- **Actor and goal.** The single local learner studies a real French ACR lesson about images and tags offline, without signing in.
- **Preconditions.** The app starts with no downloaded lesson. All published course content is accessible. The first publication contains one static French ACR lesson with stable ID, content version, actual source verification date, and official Microsoft URL.
- **Trigger.** The learner opens the lesson, or explicitly downloads its course while connected and subsequently restarts the app offline.
- **Expected outcome.** Fresh offline opening shows a French connection-required message. Following explicit course download and restart offline, opening shows the French images-and-tags lesson, stable lesson ID, content version, verification date, and official Microsoft URL from persisted content.
- **Agreed observable tests.** (1) With fresh local storage and no connection, opening the lesson displays the French connection-required state. (2) After an explicit course download while connected, restarting offline preserves and opens the French lesson with its requested teaching content and every provenance field above.
- **Boundaries.** Preserve existing download/opening contracts and their tests. This increment covers one real static lesson, French UI, full published access, and local content persistence only. It does not establish progress, quizzes, mock-exam scoring, account, synchronization, or commercial contracts. Existing interruption/retry behavior remains in force; further production failure contracts require collaboration.
- **Status.** Agreed examples pass in the UI suite, including route remount with preserved local storage to simulate restart; the 11 existing application tests also pass. Installed-device cold launch without connectivity remains unverified; automated results do not claim that device acceptance.

## Product and architecture

- Build a mobile learning experience with a fresh, original UI.
- Use domain-driven design, reusable application use cases and explicit interfaces with dependency inversion. Domain/application rules must not depend on UI frameworks or infrastructure providers.
- Reuse the learning model across curricula and themes; do not hard-code Azure-specific behavior into the shared learning rules.
- Initial curriculum: AI-200, French in the personal release; English remains later scope.
- Additional curriculum scope: culture générale and French lycée seconde, première, and terminale. Their precise subject coverage, sequencing, and launch schedule remain unresolved.

## AI-200 curriculum authority

Use the [official Microsoft AI-200 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200) as the curriculum reference. Verified on 2026-11-22; the page states last updated 2026-10-30. Its four domains are:

| Domain                                                       | Exam weighting |
| ------------------------------------------------------------ | -------------- |
| Develop containerized solutions on Azure                     | 20–25%         |
| Develop AI solutions by using Azure data management services | 25–30%         |
| Connect to and consume Azure services                        | 20–25%         |
| Secure, monitor, and troubleshoot Azure solutions            | 20–25%         |

These describe curriculum coverage, not an invented mastery scoring formula. The guide explicitly includes building and managing images and running Tasks in Azure Container Registry, supporting the proposed first slice.

## Later learner experience

- Provide login, an avatar, XP, and visible mastery progress.
- Let learners select a learning track.
- Offer daily study goals of 5, 15, or 30 minutes.
- Daily push reminders are opt-in, at a time chosen by the learner. Remaining scheduling details and permission-denial behavior require agreement. A notification or app launch alone does not constitute studying.
- Completing a lesson or review qualifies for a streak. Time-zone/day boundaries and interruption rules require agreement.
- Keep XP and mastery distinct: XP supports cosmetic rewards; mastery governs progression. Their formulas remain unresolved.
- Preserve accessibility in the original UI; detailed design and interaction choices require collaboration.

## Lessons and languages

The under-250-word limit and shared content identity remain applicable. English delivery is deferred beyond the personal release.

- Every lesson is strictly under 250 words in each localization.
- English and French localizations share the same stable lesson/content identity, so changing language does not create a separate learning record.
- Both eventual languages must be supported; precise translation, fallback, and word-count conventions remain unresolved.
- Lessons must be reusable within curricula/themes while retaining their identity and source information.

### Accepted editorial and UX preferences

- Prefer useful content over decorative slogans. Remove “Préparez AI-200, une idée à la fois.” and “Comprendre Azure AI, une idée à la fois.”; do not replace them with filler. Preserve legible accents, including the cedilla in “Leçons”, with visual verification.
- Introduce technical lessons through a concrete example before dense definitions. For ACR images and tags, use an image reference such as `monregistre.azurecr.io/api:v1` to ground the explanation.
- On first occurrence, italicize the English technical term and follow it with the Microsoft French term in parentheses. Preserve literal command and resource identifiers.
- Include relevant, commented, copy-ready Bash and PowerShell examples in fenced blocks. Downloaded lessons must retain their formatting and permit offline consultation and copying; running Azure commands may still require connectivity and Azure access. Commands do not authorize resource provisioning.
- Changes to lesson structure must account for already downloaded content and earlier stored formats. Agree update/recovery behavior and observable tests before implementation; do not silently discard downloads.
- The course hero is currently static. Its destination and opening behavior remain undecided and need explicit agreement before navigation changes.

**Pending proposal, not a rule change:** use 250 words as a soft prose target excluding code and comments. Explicit approval is required before changing the existing strict under-250-word rule or its validation; the counting convention remains unresolved. Agree use cases and observable tests before implementing these editorial or UI changes.

## Later practice and review

Local quizzes, hands-on practice, and a timed mock covering official objectives are next preparation goals. Detailed contracts remain open; commercial review limits below apply only to a later commercial release.

- Quizzes provide immediate explanations.
- After three mistakes, require rereading the lesson before retrying. Retrying is free. The mistake-count scope and how rereading is recognized remain unresolved.
- Occasionally offer flashcards with four answer choices. They award XP and are exempt from the dedicated review limit. Timing, frequency, and XP amounts remain unresolved.
- Free learners receive three dedicated review sessions per day. Define what counts as one dedicated review session and the daily reset before implementation.
- Do not conflate free quiz retries or occasional flashcards with the limited dedicated review activity.

## Later progression and payment

Personal-release access is full access to all published content. The following commercial and mastery-gated model is deferred.

- The first 25% of the curriculum is initially available for free. Mastering each available quarter unlocks the next quarter for free: 25% → 50% → 75% → 100% access. Exact mastery criteria remain unresolved.
- A full free learning path must remain available through mastery progression; payment cannot be required to finish the curriculum.
- Payment grants immediate full access and unlimited dedicated reviews. Payment confirmation, entitlement scope, duration, restoration, and offline behavior require agreement before implementation.
- XP rewards are cosmetic. Do not substitute XP spending or an unagreed XP threshold for the mastery-based free path.
- Provide an app-issued mastery badge for LinkedIn. It must be presented as the application's badge, with no claim of Microsoft certification. Award criteria and sharing mechanics remain unresolved.

## Offline study and synchronization

- The personal learner can study offline using current downloaded content without sign-in; accounts are later scope. Do not assume that undownloaded lessons are available offline.
- One course-level save/download icon tap saves all unlocked lessons in the currently selected language only. Individually completed saves remain usable after an interruption; retry saves the remaining lessons. A course-level tick appears only after all unlocked lessons in that selected language have saved successfully. A lesson-level tick signifies that individual lesson is completely saved.
- Provide a dedicated Downloads view alongside Lessons. The authorized sample integration lists persisted synthetic lesson localizations; production listing and persistence still require agreed contracts and tests.
- In the personal release, every published lesson is download-eligible. In a later gated release, download eligibility follows unlocked curriculum access. A learner with 25% access can download only the first unlocked 25%. This access boundary must be covered by agreed observable tests before implementation.
- Synchronize offline learning when connectivity returns, preserving learner progress.
- Synchronization must be idempotent: replaying or retrying the same operation cannot duplicate progress, XP, or dedicated review consumption.
- The personal first slice includes offline content study; synchronization is deferred until an account-based release and requires its own agreed contract.
- Collaboratively define observable behavior for interrupted downloads, interrupted sync, retries, content revisions, account boundaries, conflicting devices, and offline review limits before implementing affected behavior. No merge strategy, quota authority, or offline entitlement policy is selected yet.

## Source freshness and Azure costs

- Verify learning sources weekly against official references.
- Show content version, verification date, and official source links on-device, including for downloaded study content. A content version and a verification date are separate facts.
- Do not imply a successful verification when a check failed. Publication, stale-content handling, and verification ownership must be agreed before implementation.
- When presenting real Azure costs, use regional pricing and currency configuration, include the pricing date, and link the official pricing source. Do not present an undated global price as a current regional cost.
- Pricing lookup/provider, refresh mechanics, regions, currency defaults, assumptions, and any resource-provisioning scope remain unresolved. This requirement does not authorize provisioning paid Azure resources.

## Existing application contracts and original slice proposal

The personal-release use case above defines current delivery scope. Signed-in actor assumptions below describe the original application contracts; the personal adapter supplies full published access without authentication. Proposed bilingual content, completion, and synchronization work below is deferred as specified above.

The bilingual English/French Azure Container Registry slice contains five distinct workflow responsibilities: **Download eligible content**, **List downloads**, **Open a downloaded lesson**, **Record lesson completion**, and **Synchronize pending completions**; the **Open a downloaded lesson** and **Save a course offline** contracts and observable tests below are agreed. The user selected Vitest and authorized implementing the first use case after demonstrating the agreed tests fail for the missing behavior, following AGENTS.md.

### Open a downloaded lesson — agreed contract

- **Actor and goal.** A signed-in AI-200 learner eligible to access the lesson requests a downloaded Azure Container Registry lesson offline in English or French.
- **Preconditions.** Identity and access eligibility are already established. The requested current lesson localization has been downloaded completely. Establishing identity/access and account/session validity are separate concerns whose rules remain open.
- **Trigger.** The learner requests the downloaded lesson in English or French.
- **Expected outcome.** Return the requested localized lesson with its stable lesson identity, content version, verification date, and official source links, available offline. English and French share the same lesson identity. Each localization is strictly under 250 words; the word-count convention remains open.
- **Alternate/error path.** A missing or incomplete download indicates that a connection is needed to download the lesson. Precise messages and download recovery behavior remain open.
- **Boundaries.** This pure TypeScript application use case depends only on an application-owned read-only content reader and does not mutate progress. The separately authorized Expo sample integration below supplies its AsyncStorage reader and delegates lesson opening to this use case. Network, storage, authentication, and other infrastructure remain outside domain/application rules; their production contracts remain open. Exact ACR lesson coverage, locale fallback, and content-revision behavior remain open.

### Open a downloaded lesson — agreed tests and setup

- Use Vitest for pure TypeScript application tests, installed as a development dependency with `npm test` invoking `vitest run`. No UI test setup, storage adapter, or additional configuration is needed for this scope.
- With complete English and French downloads under the same stable lesson identity, requesting either locale returns its corresponding content, identity, version, verification date, and official source links. Both fixtures share identity and provenance; their content differs.
- Read the exact requested lesson ID and locale once through an injected read-only downloaded-content reader. Observable tests use a keyed in-memory reader: an unknown lesson ID returns connection-required, and each requested locale returns its own content. They assert results rather than method-call arguments.
- Missing and incomplete downloads each return a connection-required outcome.
- The application boundary has only a read-only content dependency, with no progress writer, network, or authentication dependency. Identity and eligibility are pre-established; opening cannot access progress through this boundary.
- Fixtures contain synthetic short localized text, not agreed ACR teaching content. Word-count conventions, fallback policy, storage failures, and real download/content validation remain open.
- All five agreed tests failed against the explicit not-implemented placeholder before implementation. The pure TypeScript implementation returns complete downloads and indicates connection-required for missing or incomplete downloads. Lesson entities and download value objects use readonly Zod-inferred types; schemas preserve the existing agreed shapes without introducing runtime validation policy.

### Save a course offline — agreed contract and observable tests

- **Actor and goal.** A signed-in learner saves the currently unlocked lessons of one course for offline study in the selected English or French locale.
- **Preconditions.** Sign-in is established externally. An application-owned course-access reader supplies the currently unlocked lesson IDs for the requested course; its adapter decides entitlement. This use case does not calculate fractions, mastery, payment, or eligibility.
- **Trigger.** The learner taps the course save icon. The application boundary receives course ID, selected locale, and explicit access, source, and local-download dependencies. This functional boundary keeps infrastructure outside the use case.
- **Expected outcome.** Save only the supplied unlocked lessons in the selected locale. A completely saved lesson remains openable through the existing opening use case. Return `saved` only after every supplied unlocked lesson is complete; only that outcome permits the course tick.
- **Interruption and retry.** A source result of `undefined` or a local writer result of `false` reports a recoverable interruption, returning `interrupted` without a course tick. Earlier completed saves remain openable offline. Retry skips already complete local lessons and saves the remaining lessons.
- **Agreed executable examples (Vitest).** For both English and French: with eight synthetic course lessons and an access reader supplying the first two (25%), saving succeeds, those two selected localizations open with their full identity and provenance, and all locked lessons and the other locale require a connection. Interruption on the second lesson returns `interrupted`, preserves the first as openable, and leaves the second unavailable. Restoring the second source lesson while removing the first from the source lets retry succeed and both local lessons open. Assertions use keyed in-memory fakes and outcomes, without interaction spies.
- **Boundaries and open edges.** This contract authorizes the application boundary and its agreed tests. The separately agreed synthetic-sample integration below authorizes its scoped UI and AsyncStorage adapter; production infrastructure beyond the agreed personal-release static-content increment remains outside scope. Writer-failure examples, thrown infrastructure errors, an empty unlocked list, concurrent saves, account boundaries, content revisions, and changing entitlements during a save still require collaboration before their affected behavior is implemented. Existing download-reader and lesson shapes are reused; no progress, XP, review, or synchronization dependency is introduced.

### Remaining first-slice contracts — proposed, not agreed

- **Download eligible content.** The Save a course offline application contract and observable tests above are agreed. Production infrastructure adapters and remaining failure handling still require agreement; the scoped persistent synthetic-sample integration is authorized below.
- **List downloads.** The visible download list is a settled requirement. Its production use-case contract and observable tests still require agreement; the dedicated Downloads placement and scoped sample listing below are authorized.
- **Record lesson completion.** Proposed actor: the signed-in eligible learner. Proposed trigger: explicitly marking the lesson complete. Proposed outcome: local completion, retaining one completion for the stable lesson identity across language changes or repeated actions. Completion criteria, input/output contract, and observable tests remain to be agreed.
- **Synchronize pending completions.** Proposed trigger: connectivity returning. Proposed outcome: preserve local completion remotely, retain pending progress after interruptions, and avoid duplicate completion on retries. Its contract, transport, persistence, account boundaries, conflicting-device behavior, and observable tests remain to be agreed. Offline study remains required for the personal slice; synchronization belongs to the later account-based scope.

The original journey proposed ACR coverage of what the registry stores and how tags label images, with both English and French localizations downloaded in advance. These content/download details remain proposals. It also proposed excluding quizzes, dedicated reviews, XP and mastery calculations, and actual Azure resource provisioning from this slice; these boundaries remain proposals for the remaining contracts. Completion qualifies for a streak under the existing rule, but streak calculation, day boundaries, and interruption rules still require agreement.

## Unresolved decisions register

These questions are separate from the settled rules above. Resolve only what the next agreed use case needs, with the user:

- **Technology:** Expo is selected for the mobile scaffold. Mobile platforms, distribution, backend, persistence, sync transport, test tools beyond the selected Vitest application tests, hosting, and remaining stack choices are unresolved.
- **Identity:** authentication provider/methods, account lifecycle, offline sign-in/session validity, and account-switch behavior.
- **Commercial terms:** billing provider, price, purchase model, entitlement duration/scope, confirmation, restoration, refunds, and regional billing rules.
- **Learning model:** exact mastery criteria and calculation/evidence, quiz structure, mistake-count scope, reread completion, review session definition and daily reset.
- **Rewards:** XP amounts and thresholds, cosmetic catalog, flashcard cadence, badge award and LinkedIn sharing mechanics.
- **Habits:** goal completion measurement, time zone/day boundaries, streak interruption rules, remaining reminder scheduling details, and permission-denial experience.
- **Content:** remaining first-slice contracts/tests, ACR lesson coverage, localization process/fallback, word counting, curriculum/theme taxonomy, and later curriculum sequencing.
- **Offline consistency:** download lifecycle, content-version migration, conflict resolution, multi-device reconciliation, daily quota enforcement, pending writes, and offline paid access.
- **Operations and design:** weekly verification process and failure policy, Azure price configuration, privacy/security details, accessibility targets, and original visual direction.

Resolve and document decisions explicitly; do not infer answers from a framework convention, this proposal, or the presence of a requirement.

## Previously authorized Expo persistent sample preview

This section records the earlier preview and storage authorization. The agreed personal-release scope above replaces its visible synthetic curriculum, bilingual UI, and illustrative locked access; historical regression contracts remain preserved.

The user authorized an original Lessons and Downloads visual preview using synthetic bilingual content and illustrative 25% unlocked / locked access states. Lesson opening delegates to the existing application use case and returns connection-required for missing content. Sample metadata does not establish a content publication or freshness policy.

The user selected AsyncStorage (Expo SDK 58 bundled version 2.2.0) for synthetic lesson content and metadata only. The Lessons preview now saves the first two unlocked samples of an explicitly eight-lesson course in the selected locale through the agreed application use case. The six locked samples cannot be saved. English and French saves remain independent. Downloads lists all complete saved sample localizations and opens them through the existing read-only use case; there is no initially preloaded cache. Completed samples survive interrupted saves and application restarts; retry saves the remaining samples. A course tick requires both unlocked samples in the selected locale to be found complete in storage.

Storage uses namespaced per-lesson/per-locale records. Parsed records must satisfy the existing lesson schema, match their requested identity/locale, and contain only the known official preview reference. Invalid records remain unavailable; storage errors are shown with a recoverable retry/refresh path. AsyncStorage is for these public synthetic samples only, not credentials or production learner data. Production authentication, content delivery, access policy, learner-data persistence, progress, and synchronization remain outside this authorization and require explicit collaboration on contracts and tests.

The user selected React Native Reusables with Uniwind/Tailwind for shared styling of the existing Expo Lessons/Downloads preview across iOS, Android, and web. This styling migration preserves preview behavior, content, accessibility, native navigation, and splash; it does not authorize additional production behavior.

The agreed personal-release static-content increment above extends this sample authorization. Earlier statements that production delivery/access require agreement do not reopen the explicitly agreed French single-learner scope; remaining production concerns stay open.
