# 🥗🗃️ Family Serve Database

<div align="center">

**MongoDB database layer for the [Family Serve Delicious](https://github.com/Axyor/family-serve-delicious) application. This package handles dietary profiles, preferences, and restrictions for family groups.**

</div>

<div align="center">

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/Axyor/family-serve-delicious/actions)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/Axyor/family-serve-delicious)
[![NPM Version](https://img.shields.io/npm/v/@axyor/family-serve-database.svg)](https://www.npmjs.com/package/@axyor/family-serve-database)
[![License](https://img.shields.io/npm/l/@axyor/family-serve-database.svg)](LICENSE)

</div>

This package provides a robust and well-tested database layer for managing family-related data, including dietary needs, health goals, and personal profiles. It is designed to be used as a module within a larger Node.js application.

## 🚀 Getting Started

This section is for developers who want to use this package in their own projects.

### Prerequisites

- Node.js >= 18.0.0
- A running MongoDB instance

### Installation

To install the package, use npm:

```bash
npm install @axyor/family-serve-database
```

### Quick Start

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
| `findMembersByRestriction(groupId, type, reason)` | Finds members in a group by their dietary restriction. |

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

<<<<<<< HEAD
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
=======
### Installation

```bash
# Install dependencies
npm install

# Build the package
npm run build
>>>>>>> 8022fd4 (Implement tests and data for testing)
```
</details>

<<<<<<< HEAD
## 📜 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
=======
### Testing

This project includes a comprehensive test suite to ensure code stability and reliability. Tests are run in an isolated environment using Docker, ensuring consistent and reproducible results without affecting your local development database.

Prerequisites
Docker must be installed and running on your machine.

**Recommended Method (All-in-One)**  

For a quick validation, this command handles the entire cycle: starts the container, runs the tests, and cleans up afterward.

```bash
# Start Docker, run tests, then stop and clean up the container

npm run docker:test
```
**Manual Commands**  

For more granular control during development, you can use the commands separately.
```bash
# 1. Start the MongoDB container in the background
npm run docker:up

# 2. Run tests once
npm test

# Or run tests in watch mode
npm run test:watch

# Or run tests with code coverage report
npm run test:coverage

# 3. Stop and remove the MongoDB container
npm run docker:down
```

**Test Environment**  

Tests use a dedicated MongoDB database named family-serve-test, which is separate from your development database. This database is automatically created and cleaned before each test run to guarantee a clean slate.

**Test Data**  

To ensure robust coverage, tests are seeded with a rich dataset that includes a variety of profiles, such as:

Family Roles: Working Parent, Stay-at-home Parent, Teenager, Child, Grandparent.

Health Goals: Weight Loss, Maintenance, Athletic, Muscle Gain, Recovery.

Dietary Profiles: Gluten-Free, Vegetarian, Keto, Athletic Bulking, and various Food Allergies.


## License

ISC - [Learn more](LICENSE)
>>>>>>> 8022fd4 (Implement tests and data for testing)
