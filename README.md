# 🥗🗃️ Family Serve Database

<div align="center">

**MongoDB database layer for the [Family Serve Delicious](https://github.com/Axyor/family-serve-delicious) application. This package handles dietary profiles, preferences, and restrictions for family groups.**

</div>

<div align="center">

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/Axyor/family-serve-database/actions)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/Axyor/family-serve-database)
[![License](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](LICENSE)

</div>

Database / domain layer for managing families, nutrition profiles, restrictions, and health goals. Includes validation (Zod), domain layer (GroupEntity / MemberEntity), Mongoose virtuals, and concurrency tests.

> See the [CHANGELOG](CHANGELOG.md) for release history. Current major: 2.x.

## 🚀 Getting Started

This section is for developers who want to use this package in their own projects.

### Prerequisites

- Node.js >= 18.0.0
- A running MongoDB instance

### Installation

This package is published to GitHub Packages. You must configure npm to use the GitHub npm registry for the `@axyor` scope and provide a token.

1) Create or update your project-level `.npmrc` (recommended):

```ini
@axyor:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

2) Install the package:

```bash
npm install @axyor/family-serve-database
```

Notes:
- Replace `${GITHUB_TOKEN}` with a Personal Access Token that has `read:packages` (for local dev), or rely on CI’s `GITHUB_TOKEN` in GitHub Actions.
- You can also set the token globally in `~/.npmrc` if preferred.

### Quick Start (ESM & CommonJS)

You can consume this package from either native ESM or CommonJS without dynamic import hacks.

ESM (Node >=18):

```ts
import { Database } from '@axyor/family-serve-database';
await Database.initialize('mongodb://localhost:27017/family-serve');
```

CommonJS:

```js
const { Database } = require('@axyor/family-serve-database');
Database.initialize('mongodb://localhost:27017/family-serve').then(() => {
    // ...
});
```

Here's a simple example of how to initialize the database and use the `GroupService`.

```typescript
import { Database } from '@axyor/family-serve-database';

// Initialize the database connection
await Database.initialize('mongodb://localhost:27017/family-serve');

// Get service instance
const db = Database.getInstance();
const groupService = db.getGroupService();

// Create and manage groups
const group = await groupService.createGroup('Smith Family');
console.log('Created group:', group);
```

## 📖 API Reference

The primary way to interact with the database is through services.

### GroupService

The `GroupService` provides methods for managing groups and their members.

<details>
<summary>View GroupService Methods</summary>

| Method                       | Description                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------- |
| `createGroup(name)`          | Creates a new group with the given name.                                     |
| `getGroup(id)`               | Retrieves a group by its ID.                                                 |
| `addMember(groupId, member)` | Adds a new member to a group.                                                |
| `updateMember(groupId, memberId, update)` | Updates a member's profile in a group.                               |
| `removeMember(groupId, memberId)` | Removes a member from a group.                                               |
| `updateMemberRestrictions(groupId, memberId, restrictions)` | Updates all dietary restrictions for a member. |
| `addMemberRestriction(groupId, memberId, restriction)` | Adds a new dietary restriction to a member's profile. |
| `removeMemberRestriction(groupId, memberId, restrictionId)` | Removes a specific dietary restriction from a member. |
| `updateMemberMetrics(groupId, memberId, weightKg, heightCm)` | Updates the physical metrics (weight, height) of a member. |
| `updateMemberHealthGoals(groupId, memberId, goals)` | Updates a member's health goals. |
| `updateMemberAllergies(groupId, memberId, allergies)` | Updates a member's allergies. |
| `findMembersByRestriction(groupId, type, reason)` | Returns summary {groupId,name,totalMembers,filteredCount,members[]} via domain entity. |

</details>

### Enums

The package exports several enums to ensure type safety.

<details>
<summary>View Available Enums</summary>

```typescript
enum EDietaryRestrictionType {
    FORBIDDEN = 'FORBIDDEN', // e.g., allergies
    REDUCED = 'REDUCED'      // e.g., dietary choices
}

enum EDietaryRestriction {
    VEGETARIAN = 'VEGETARIAN',
    VEGAN = 'VEGAN',
    GLUTEN_FREE = 'GLUTEN_FREE',
    DAIRY_FREE = 'DAIRY_FREE'
    // ... and more
}

enum EActivityLevel {
    SEDENTARY = 'SEDENTARY',
    LIGHTLY_ACTIVE = 'LIGHTLY_ACTIVE',
    MODERATELY_ACTIVE = 'MODERATELY_ACTIVE',
    VERY_ACTIVE = 'VERY_ACTIVE'
}

enum EGroupRole {
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER'
}

enum EGender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER'
}

enum EHealthGoal {
    WEIGHT_LOSS = 'WEIGHT_LOSS',
    MUSCLE_GAIN = 'MUSCLE_GAIN',
    MAINTENANCE = 'MAINTENANCE',
    // ... and more
}
```

</details>

## 🏗️ Data Models

The database uses Mongoose schemas to define the structure of the data.

<details>
<summary>View Group Schema</summary>

```json
{
  "name": "String",
  "members": "[MemberProfile]",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```
</details>

<details>
<summary>View MemberProfile Schema</summary>

```json
{
    "role": "EGroupRole",
    "firstName": "String",
    "lastName": "String",
    "age": "Number",
    "gender": "EGender",
    "weightKg": "Number",
    "heightCm": "Number",
    "activityLevel": "EActivityLevel",
    "healthGoals": ["EHealthGoal"],
    "dietaryProfile": {
        "preferences": {
            "likes": ["String"],
            "dislikes": ["String"]
        },
        "allergies": ["String"],
        "restrictions": [{
            "type": "EDietaryRestrictionType",
            "reason": "EDietaryRestriction | String",
            "notes": "String"
        }],
        "healthNotes": "String"
    }
}
```
</details>

## 🧠 Domain Layer

Domain entities encapsulate behavior beyond raw persistence:

```ts
const group = await groupService.getGroup(id);
// Wrap in entity to add richer behavior
import { GroupEntity } from '@axyor/family-serve-database';
const entity = new GroupEntity(group!);
const glutenFree = entity.summaryByRestriction('FORBIDDEN','GLUTEN_FREE');
```

Benefits:
- Single place to evolve business logic.
- Keeps repository/service thin.
- Easier future persistence changes (embedded → separate collection).

## ✅ Validation

Inputs validated with Zod (`GroupCreateSchema`, `MemberProfileCreateSchema`). Invalid data → exception before hitting DB.

## 🧪 Testing

Run all tests with Docker Mongo:
```bash
npm run docker:test
```
Focus during development:
```bash
docker compose up -d
npm test -- --watch
```

### 🔐 Secure local MongoDB with .env

For local development with Docker, credentials are provided via a `.env` file (not committed).

1) Copy the example and adjust values:
```bash
cp .env.example .env
```
2) Start MongoDB:
```bash
docker compose up -d
```

The `docker-compose.yml` reads the following variables from `.env`:
- `MONGO_INITDB_DATABASE`
- `MONGO_INITDB_ROOT_USERNAME`
- `MONGO_INITDB_ROOT_PASSWORD`

Note: The test suites connect to `mongodb://test_user:test_password@localhost:27017/...` by default; the `.env.example` aligns with these defaults for convenience.

Included test types:
- Repository CRUD + nested updates
- Concurrency (parallel addMember)
- Validation & error tests
- Domain summary behavior

## 🔧 Developer Experience

Scripts:
```bash
npm run lint       # analyse
npm run lint:fix   # auto-fix
npm run build      # compile TS
npm run docker:test
```

Editor support: `.editorconfig`, ESLint + TypeScript rules.

## 📜 License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See the [LICENSE](LICENSE) file for details.
