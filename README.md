# beCertified

A mobile learning product combining short lessons, practice, mastery progression, and cosmetic rewards. The initial curriculum prepares learners for AI-200 in English and French. Reusable curricula and themes will also support culture générale and French lycée seconde, première, and terminale.

The architecture must use reusable domain-driven design (DDD) use cases and interfaces with dependency inversion. Expo is selected for the mobile scaffold; platform, provider, and remaining implementation decisions are unresolved.

## Read first

- [AGENTS.md](AGENTS.md): mandatory collaboration and development workflow.
- [PRODUCT_RULES.md](PRODUCT_RULES.md): authoritative product requirements, proposed first slice, and unresolved decisions.

## Current stage

The Expo default scaffold is initialized. The proposed first slice is a bilingual Azure Container Registry learning experience, including offline study and synchronization. Its precise first use case and test cases must be written collaboratively with the user before implementation. The scaffold is setup only; no learning behavior or product tests have been implemented.

Every behavior change starts with a collaboratively agreed use case, followed by collaboratively agreed tests, before implementation. This applies to the first slice and every subsequent change.

## Run the scaffold

Install dependencies with `npm ci`, then start the development server with `npm start`. Follow the [official Expo setup guide](https://docs.expo.dev/get-started/create-a-project/) for device and emulator setup.
