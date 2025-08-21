import { IMemberProfile, IGroup } from '../../src/interfaces/types';
import { DIETARY_PROFILES } from './fixtures/dietary-profiles';
import { HEALTH_PROFILES } from './fixtures/health-profiles';
import { FAMILY_MEMBERS } from './fixtures/family-members';
import { IMemberTemplate, IHealthTemplate, IDietaryTemplate } from './fixtures/types.js';

function createMember(
    firstName: string,
    lastName: string,
    baseProfile: IMemberTemplate,
    healthProfile: IHealthTemplate,
    dietaryProfile: IDietaryTemplate
): IMemberProfile {
    return {
        id: `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Date.now()}`,
        firstName,
        lastName,
        ...baseProfile,
        ...healthProfile,
        dietaryProfile
    };
}

function createFamily(name: string, members: IMemberProfile[]): Omit<IGroup, 'id'> {
    return {
        name,
        members,
        createdAt: new Date(),
        updatedAt: new Date()
    };
}

declare const db: {
    getSiblingDB: (name: string) => any;
    groups: {
        insertMany: (docs: any[]) => void;
        drop: () => void;
    };
};

const database = db.getSiblingDB('family-serve-test');

// Nettoyage de la collection avant l'insertion pour éviter les doublons
database.groups.drop();

console.log('Collection groups supprimée. Insertion des nouvelles données...');


database.groups.insertMany([
    createFamily("Smith Family", [
        createMember(
            "John",
            "Smith",
            FAMILY_MEMBERS.WORKING_PARENT,
            HEALTH_PROFILES.WEIGHT_LOSS_ACTIVE,
            DIETARY_PROFILES.GLUTEN_FREE_HIGH_PROTEIN
        ),
        createMember(
            "Jane",
            "Smith",
            FAMILY_MEMBERS.STAY_AT_HOME_PARENT,
            HEALTH_PROFILES.MAINTENANCE,
            DIETARY_PROFILES.VEGETARIAN_LACTOSE_INTOLERANT
        ),
        createMember(
            "Emma",
            "Smith",
            FAMILY_MEMBERS.TEENAGER,
            HEALTH_PROFILES.ATHLETE,
            DIETARY_PROFILES.ATHLETE_BULKING
        )
    ]),
    createFamily("Johnson Family", [
        createMember(
            "Mike",
            "Johnson",
            FAMILY_MEMBERS.WORKING_PARENT,
            HEALTH_PROFILES.MUSCLE_GAIN,
            DIETARY_PROFILES.ATHLETE_BULKING
        ),
        createMember(
            "Sarah",
            "Johnson",
            FAMILY_MEMBERS.STAY_AT_HOME_PARENT,
            HEALTH_PROFILES.MAINTENANCE,
            DIETARY_PROFILES.LOW_CARB_KETO
        )
    ]),
    createFamily("Wilson Family", [
        createMember(
            "David",
            "Wilson",
            FAMILY_MEMBERS.WORKING_PARENT,
            HEALTH_PROFILES.MAINTENANCE,
            DIETARY_PROFILES.LOW_CARB_KETO
        ),
        createMember(
            "Linda",
            "Wilson",
            FAMILY_MEMBERS.STAY_AT_HOME_PARENT,
            HEALTH_PROFILES.RECOVERY,
            DIETARY_PROFILES.FOOD_ALLERGIES
        ),
        createMember(
            "Tom",
            "Wilson",
            FAMILY_MEMBERS.CHILD,
            HEALTH_PROFILES.MAINTENANCE,
            DIETARY_PROFILES.FOOD_ALLERGIES
        ),
        createMember(
            "Martha",
            "Wilson",
            FAMILY_MEMBERS.GRANDPARENT,
            HEALTH_PROFILES.RECOVERY,
            DIETARY_PROFILES.VEGETARIAN_LACTOSE_INTOLERANT
        )
    ])
]);
