# Family Serve Database

Ce package fournit la couche d'accès aux données pour l'application Family Serve Delicious.

## Installation

```bash
npm install @family-serve/database
```

## Configuration

Le package nécessite une connexion MongoDB. Pour l'initialiser :

```typescript
import { Database } from '@family-serve/database';

// Initialiser la connexion
await Database.initialize('mongodb://localhost:27017/family-serve');

// Obtenir l'instance du service
const db = Database.getInstance();
const groupService = db.getGroupService();

// Utiliser le service
const group = await groupService.createGroup('Ma Famille');
```

## Structure

- `src/interfaces/` - Définitions des types et interfaces
- `src/models/` - Schémas Mongoose
- `src/repositories/` - Couche d'accès aux données
- `src/services/` - Logique métier

## Exemple d'utilisation

```typescript
import { Database, EGender, EGroupRole, EDietaryRestriction } from '@family-serve/database';

async function example() {
    const db = await Database.initialize('mongodb://localhost:27017/family-serve');
    const groupService = db.getGroupService();

    // Créer un groupe
    const group = await groupService.createGroup('Ma Famille');

    // Ajouter un membre
    await groupService.addMember(group._id, {
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
        gender: EGender.MALE,
        role: EGroupRole.ADMIN,
        dietaryProfile: {
            preferences: {
                likes: ['Pizza', 'Pasta'],
                dislikes: ['Olives']
            },
            allergies: ['Peanuts'],
            restrictions: [EDietaryRestriction.GLUTEN_FREE]
        }
    });
}
```
