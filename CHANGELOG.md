## Changelog

All notable changes to this project will be documented in this file. Adheres (lightly) to [Keep a Changelog](https://keepachangelog.com) and [SemVer](https://semver.org).

### [2.4.0] - 2026-06-27
Added
- `IGroupSummary` type for lightweight group representation (`id`, `name`, `memberCount`, timestamps).
- `listGroupsSummary()` on `GroupService` — returns all groups without full member payloads via a lean MongoDB projection (efficient listing).
- `addMemberAllergy()` and `removeMemberAllergy()` exposed on `GroupService` (previously implemented at the repository level but unreachable through the service API).
- `resetNameSearchCollation()` exported from config module for test isolation.
- Zod `max()` constraints on all string and array fields (e.g. names ≤ 100 chars, allergies array ≤ 50 items). Invalid inputs that previously slipped through will now throw at validation.

Changed
- `IGroup.numberOfPeople` is now required (`number`, was `number?`). The value is computed by `transformWithId` from the members array length; the Mongoose virtual has been removed.
- `getNameSearchCollation()` result is now memoised — env vars are read once at startup instead of on every call.
- `updateMemberAllergies()` in `GroupService` delegates directly to the atomic repository method, eliminating a read + write round-trip.
- Mongoose `{ new: true }` replaced with `{ returnDocument: 'after' }` across all `findOneAndUpdate` calls (Mongoose 9 alignment).

Refactored
- Removed `src/interfaces/index.ts` — was a full duplicate of the types scattered across the other interface files; not part of the public API surface.
- Removed `memberTransform` from `utils/transform.ts` (internal helper, unused after the `transformWithId` consolidation).
- Removed `Object.freeze()` calls on TypeScript enums (no-op at runtime when `isolatedModules` is off).

Migration Notes
1. If you construct `IGroup` objects directly (e.g. in tests or mocks) and relied on `numberOfPeople` being optional, provide it explicitly — `group.members.length` is the canonical value.
2. Validation is now stricter on string lengths and array sizes. Review any fixtures or seed data that contains unusually long strings or large arrays.

### [2.3.0] - 2026-01-18
Changed
- Upgraded all runtime dependencies to their latest major versions: Mongoose 9, Zod 4, Pino 9.
- Updated dev tooling: TypeScript 5.7, Jest 29, ESLint 9.

Migration Notes
- Follow the [Mongoose 8 → 9 migration guide](https://mongoosejs.com/docs/migrating_to_9.html) if you extend the models directly.
- Zod 4 introduces stricter schema inference; see the [Zod v4 changelog](https://zod.dev/changelog).

### [2.2.2] - 2025-11-21
Fixed
- Updated CI workflow to use MongoDB port `27018` to match test configuration.

### [2.2.1] - 2025-11-21
Changed
- Pinned MongoDB version to `6.0` in `docker-compose.yml` for stability.
- Enabled strict type checking in `eslint.config.js` (removed `no-explicit-any: off`).
- Refactored repositories and models to remove `any` types and improve type safety.

Fixed
- Fixed duplicate key assignment in `GroupService.addMember`.
- Fixed `docker-compose.yml` port conflict (moved to `27018`).

### [2.2.0] - 2025-11-09
Changed
- Updated dependencies to latest versions for security and compatibility.
- Fixed Docker Compose configuration for improved development environment setup.
- Updated database model conception with improved type definitions.

Added
- `.env.example` file with environment variable templates for easier setup.
- Enhanced `.gitignore` with better coverage of generated and temporary files.
- Improved README documentation with clearer setup instructions.

Fixed
- Repository test adjustments for better reliability and maintainability.

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

[2.4.0]: https://github.com/Axyor/family-serve-database/compare/v2.3.0...v2.4.0
[2.3.0]: https://github.com/Axyor/family-serve-database/compare/v2.2.2...v2.3.0
[2.0.0]: https://github.com/Axyor/family-serve-database/compare/v1.0.2...v2.0.0
[2.1.0]: https://github.com/Axyor/family-serve-database/compare/v2.0.2...v2.1.0