/** Defines the severity of a dietary restriction. */
export enum EDietaryRestrictionType {
    FORBIDDEN = 'FORBIDDEN',
    REDUCED = 'REDUCED'
}

/** Enumerates common dietary plans or specific food restrictions. */
export enum EDietaryRestriction {
    VEGETARIAN = 'VEGETARIAN',
    VEGAN = 'VEGAN',
    GLUTEN_FREE = 'GLUTEN_FREE',
    DAIRY_FREE = 'DAIRY_FREE',
    NO_PORK = 'NO_PORK',
    LOW_CARB = 'LOW_CARB'
}

/** Defines the role of a member within a group. */
export enum EGroupRole {
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER',
}

/** Specifies the biological gender, primarily for nutritional calculations. */
export enum EGender {
    MALE = 'MALE',
    FEMALE = 'FEMALE'
}

/** Describes the daily physical activity level of a person. */
export enum EActivityLevel {
    SEDENTARY = 'SEDENTARY',
    LIGHTLY_ACTIVE = 'LIGHTLY_ACTIVE',
    MODERATELY_ACTIVE = 'MODERATELY_ACTIVE',
    VERY_ACTIVE = 'VERY_ACTIVE',
}

/** Lists common health and wellness goals. */
export enum EHealthGoal {
    WEIGHT_LOSS = 'WEIGHT_LOSS',
    MUSCLE_GAIN = 'MUSCLE_GAIN',
    MAINTENANCE = 'MAINTENANCE',
    IMPROVE_DIGESTION = 'IMPROVE_DIGESTION',
    HEART_HEALTH = 'HEART_HEALTH'
}

/** Represents a single dietary rule, including its type and reason. */
export interface IDietaryRestriction {
    type: EDietaryRestrictionType;
    reason: EDietaryRestriction | string;
    notes?: string;
}

/** Defines the profile for a single member, embedded within a group document. */
export interface IMemberProfile {
    readonly id: string;
    role: EGroupRole;
    firstName: string;
    lastName: string;
    age: number;
    gender: EGender;
    weightKg?: number;
    heightCm?: number;
    activityLevel?: EActivityLevel;
    healthGoals?: EHealthGoal[];
    dietaryProfile: {
        preferences: {
            likes: string[];
            dislikes: string[];
        };
        allergies: string[];
        restrictions: IDietaryRestriction[];
        healthNotes?: string;
    };
}

/**
 * Represents a group (e.g., a family) and contains all its members' profiles.
 * This is the main document schema for the 'groups' collection.
 */
export interface IGroup {
    readonly id?: string;
    name: string;
    members: IMemberProfile[];
    updatedAt: Date;
    readonly createdAt: Date;
}