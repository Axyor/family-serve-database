## Changelog

All notable changes to this project will be documented in this file. Adheres (lightly) to [Keep a Changelog](https://keepachangelog.com) and [SemVer](https://semver.org).

### [2.0.2] - 2025-08-23
Changed
- Additional CI workflow tweaks for publish (version bump only, no runtime code changes).

### [2.0.1] - 2025-08-22
Changed
- CI publish workflow adjustments (no runtime code changes).

### [2.1.0] - 2025-08-30
Added
- Dual module distribution (ESM + CommonJS) via conditional exports.
	- ESM: `import { Database } from '@axyor/family-serve-database'`
	- CJS: `const { Database } = require('@axyor/family-serve-database')`
	- Both forms expose identical named exports; enums remain frozen objects.
Internal
- Build split into `dist/esm` and `dist/cjs` from a single TS source tree.
- Added tsconfig.{esm,cjs}.json and updated scripts.
Migration Notes
- No breaking changes. Consumers using dynamic import hacks in CommonJS can simplify to direct `require` now.

### [2.0.0] - 2025-08-22
Breaking
- Removed persisted `numberOfPeople` field in favor of a Mongoose virtual (computed from members length).
- Refactored updateMember logic to whitelist + diff update (may reject previously accepted extra fields).
- Introduced domain layer (`GroupEntity`, `MemberEntity`) – service API stable but internal behavior changed.
- Validation added with Zod for create group/member (invalid inputs now throw earlier).
- Moved runtime libs (`mongoose`, `pino`, `zod`) from devDependencies to dependencies.

Additions
- Concurrency test suite and safer atomic member add.
- Logging via `pino` with pretty output in non-production.
- Enhanced member profile (nutrition targets, cuisine preferences, budgetLevel, cookingSkill, mealFrequency, fastingWindow, healthGoals).
- ESLint flat config, EditorConfig, improved README.

Internal
- Centralized ID transform helper.
- Index collation helper via env vars.

Migration Notes
1. Remove any reliance on stored `numberOfPeople`; compute `group.numberOfPeople` dynamically now.
2. If you previously sent arbitrary fields in `updateMember`, ensure only allowed fields (whitelisted simple scalars + nested dietaryProfile subpaths) are used.
3. Validate inputs earlier in your integration (errors may now surface where silent success happened before).

### [1.0.2] - 2025-08-22
- Minor adjustments and dependency organization.

### [1.0.1] - 2025-08-21
- Initial public version with basic group/member CRUD and dietary restriction features.

---

[2.0.0]: https://github.com/Axyor/family-serve-database/compare/v1.0.2...v2.0.0