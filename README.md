# 🥗🗃️ Family Serve Database

MongoDB database layer for the Family Serve Delicious application. This package handles dietary profiles, preferences, and restrictions for family groups.

## Features

- Group management with members
- Dietary profiles and preferences
- Health goals tracking
- Food allergies and restrictions management
- Activity level tracking

## Installation

```bash
npm install @family-serve/database
```

## Quick Start

```typescript
import { Database } from '@family-serve/database';

// Initialize the database connection
await Database.initialize('mongodb://localhost:27017/family-serve');

// Get service instance
const db = Database.getInstance();
const groupService = db.getGroupService();

// Create and manage groups
const group = await groupService.createGroup('Smith Family');
```

## Architecture

```
src/
├── interfaces/     # TypeScript interfaces and enums
├── models/        # Mongoose schemas and models
├── repositories/  # Data access layer
└── services/      # Business logic layer
```

## Detailed Usage

### Managing Groups and Members

```typescript
import { 
    Database, 
    EGender, 
    EGroupRole, 
    EDietaryRestriction,
    EActivityLevel 
} from '@family-serve/database';

async function example() {
    // Initialize database
    const db = await Database.initialize('mongodb://localhost:27017/family-serve');
    const groupService = db.getGroupService();

    // Create a new family group
    const group = await groupService.createGroup('Smith Family');

    // Add a family member with dietary preferences
    await groupService.addMember(group._id, {
        firstName: 'John',
        lastName: 'Smith',
        age: 35,
        gender: EGender.MALE,
        role: EGroupRole.ADMIN,
        activityLevel: EActivityLevel.MODERATELY_ACTIVE,
        healthGoals: ['Weight management', 'Energy improvement'],
        dietaryProfile: {
            preferences: {
                likes: ['Quinoa', 'Salmon', 'Avocado'],
                dislikes: ['Mushrooms', 'Cilantro']
            },
            restrictions: [
                {
                    type: EDietaryRestrictionType.FORBIDDEN,
                    reason: EDietaryRestriction.GLUTEN_FREE,
                    notes: 'Celiac disease'
                },
                {
                    type: EDietaryRestrictionType.REDUCED,
                    reason: EDietaryRestriction.DAIRY_FREE,
                    notes: 'Lactose intolerant'
                }
            ],
            healthNotes: 'Needs high-protein meals'
        }
    });

    // Retrieve group information
    const familyGroup = await groupService.getGroup(group._id);
    console.log('Family members:', familyGroup?.members);
}
```

### Available Enums

```typescript
// Dietary Restrictions Types
enum EDietaryRestrictionType {
    FORBIDDEN = 'FORBIDDEN',
    REDUCED = 'REDUCED'
}

// Dietary Restrictions
enum EDietaryRestriction {
    VEGETARIAN = 'VEGETARIAN',
    VEGAN = 'VEGAN',
    GLUTEN_FREE = 'GLUTEN_FREE',
    DAIRY_FREE = 'DAIRY_FREE'
}

// Dietary Restriction Interface
interface IDietaryRestriction {
    type: EDietaryRestrictionType;
    reason: EDietaryRestriction | string;
    notes?: string;
}

// Activity Levels
enum EActivityLevel {
    SEDENTARY = 'SEDENTARY',
    LIGHTLY_ACTIVE = 'LIGHTLY_ACTIVE',
    MODERATELY_ACTIVE = 'MODERATELY_ACTIVE',
    VERY_ACTIVE = 'VERY_ACTIVE'
}

// Group Roles
enum EGroupRole {
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER'
}
```

## Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/family-serve
```

## Development

### Installation

```bash
# Install dependencies
npm install

# Build the package
npm run build
```

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
