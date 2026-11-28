# beCertified

A mobile learning product combining short lessons, practice, mastery progression, and cosmetic rewards. The initial personal release prepares one local learner for AI-200 in French, without an account and with full access to published content. English and account-based features are later scope. Reusable curricula and themes will also support culture générale and French lycée seconde, première, and terminale.

The architecture must use reusable domain-driven design (DDD) use cases and interfaces with dependency inversion. Expo is selected for the mobile scaffold; platform, provider, and remaining implementation decisions are unresolved.

## Read first

- [AGENTS.md](AGENTS.md): mandatory collaboration and development workflow.
- [PRODUCT_RULES.md](PRODUCT_RULES.md): authoritative product requirements, proposed first slice, and unresolved decisions.

## Current stage

The Expo Lessons/Downloads app implements downloaded-lesson opening and course saving, including persistent local content and interrupted-download retry. Existing bilingual synthetic application tests remain regression coverage.

The personal release presents one real French Azure Container Registry lesson about images and tags. Download is explicit; a fresh offline open requires a connection. After download and an offline restart, the lesson must retain its identity, version, verification date, and Microsoft source URL. The agreed automated examples pass; a fully disconnected cold launch on an installed device remains unverified. Local progress, quizzes, hands-on practice, and a timed mock covering official objectives require further contracts; accounts, synchronization, monetization, and English delivery are deferred.

Every behavior change starts with a collaboratively agreed use case, followed by collaboratively agreed tests, before implementation. This applies to the first slice and every subsequent change.

## Run locally

Install dependencies with `npm ci`, then start the development server with `npm start`. Open the app through Expo, or run `npm run web` for the browser. Follow the [official Expo setup guide](https://docs.expo.dev/get-started/create-a-project/) for device and emulator setup.

Expo serves the static French course from `public/courses/ai-200.fr.json` at `/courses/ai-200.fr.json`. Web uses the current origin; native development uses the Expo development server host and port. A physical device must reach that server over the local network. No separate content server is needed.

For an installed native build, set `EXPO_PUBLIC_CONTENT_ORIGIN=https://your-host.example` before building. This HTTPS host must serve `/courses/ai-200.fr.json`, for example from a deployed Expo web export (`npx expo export --platform web`). The override requires HTTPS; local native development resolves its HTTP development origin automatically.

In **Leçons**, explicitly download the course while connected. Then restart offline and open it from **Téléchargements**. Downloaded content persists locally; a fresh installation has no downloaded lesson. Expo development still needs its JavaScript bundle available, so a fully disconnected cold launch must be checked with an installed build.
