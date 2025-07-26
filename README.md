# Family Serve Database

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
            allergies: ['Shellfish', 'Tree nuts'],
            restrictions: [
                EDietaryRestriction.GLUTEN_FREE,
                EDietaryRestriction.DAIRY_FREE
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
// Dietary Restrictions
enum EDietaryRestriction {
    VEGETARIAN = 'VEGETARIAN',
    VEGAN = 'VEGAN',
    GLUTEN_FREE = 'GLUTEN_FREE',
    DAIRY_FREE = 'DAIRY_FREE'
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

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC - [Learn more](LICENSE)
```
