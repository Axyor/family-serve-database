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

## 📜 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
