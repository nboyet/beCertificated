# Mandatory working agreement

## Authority

Read this file and [PRODUCT_RULES.md](PRODUCT_RULES.md) before proposing or changing behavior. PRODUCT_RULES.md is the authoritative product specification; this file defines the mandatory workflow. README.md is an overview, not an alternative specification. Explicit user instructions take precedence. Surface conflicts and obtain clarification instead of silently changing requirements.

Unresolved decisions in PRODUCT_RULES.md are not defaults or permission to choose. Do not invent product policy, select a framework, or settle an open decision without the user's agreement. Record agreed decisions in the specification before implementing dependent behavior.

## Use-case first, test-first, every time

1. Collaborate with the user to write the use case first: actor, goal, preconditions, trigger, expected outcome, relevant alternate/error paths, and agreed boundaries. Keep unsettled details explicitly open.
2. Collaborate with the user to write and agree the tests for that use case before implementation. Agree observable examples, expected results, and relevant failures, including offline and synchronization behavior where applicable. Do not substitute an agent-authored test list for this collaboration.
3. Resolve only the decisions needed for that use case with the user. Before implementing behavior, have the agreed tests executable and demonstrate that they fail for the intended missing behavior. If the test environment does not yet exist, first agree its technology and setup scope; no silent scaffold or framework choice.
4. Implement the smallest change that satisfies the agreed use case and tests. Run those tests, preserve existing behavior, and refactor only while they remain passing.
5. Report changed paths, checks and results, and unresolved limitations. Update these documents when agreed requirements change.

This sequence is mandatory for every behavior change, including fixes, refactors that change behavior, and later features. Never implement first and add tests afterward. If an agreed use case or tests are missing, continue the collaboration rather than implementing assumptions.

## Architecture constraints

Keep domain rules and application use cases reusable across mobile interfaces and curricula. Define interfaces at the domain/application boundary; infrastructure and UI depend inward and supply implementations. Keep framework, storage, network, authentication, notifications, and billing details outside domain rules. Do not introduce a framework or implementation structure before agreement.

Preserve validation, error handling, accessibility, privacy, and security. Include relevant failure behavior in the agreed use cases and tests. Offline operations and retried synchronization must not duplicate progress, XP, or review consumption.

## Implementation conventions

Keep one primary responsibility per use case in a `.use-case.ts` file. Functional implementations are welcome; no base classes or framework are required. When using functional programming, explain the choice and how dependencies are passed explicitly. Put domain entities in `entities/` and relevant value objects in `value-objects/`, using readonly Zod-inferred types. Schemas describe the agreed shapes; runtime validation policy remains open. Keep application reader interfaces and result types at the application boundary.

Use ZOMBIES to guide observable examples as relevant to the agreed contract. Prioritize observable outputs with keyed in-memory fakes and returned outcomes. Never use interaction assertions such as `toHaveBeenCalledWith`.

## Immediate next step

The **Open a downloaded lesson** and **Save a course offline** contracts are implemented with bilingual synthetic regression examples. Preserve those contracts and existing persistent-download recovery behavior.

The agreed next increment in PRODUCT_RULES.md is a French-only personal release for one local learner without an account, with full published access and one real static ACR images-and-tags lesson downloaded only by explicit course action. Execute the agreed fresh-offline and download/restart-offline examples test-first; report actual checks before claiming acceptance. Local progress, quizzes, hands-on practice, and a timed mock are next collaboration topics. Accounts, synchronization, monetization, and English delivery are deferred, not prerequisites for this increment.
