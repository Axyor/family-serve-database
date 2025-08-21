/** Defines the severity of a dietary restriction. */
export enum EDietaryRestrictionType {
    FORBIDDEN = 'FORBIDDEN',
    REDUCED = 'REDUCED'
}
export enum EDietaryRestriction {
    VEGETARIAN = 'VEGETARIAN',
    VEGAN = 'VEGAN',
    GLUTEN_FREE = 'GLUTEN_FREE',
    DAIRY_FREE = 'DAIRY_FREE',
    NO_PORK = 'NO_PORK',
    LOW_CARB = 'LOW_CARB',
    KOSHER = 'KOSHER'
}
export enum EGroupRole {
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER',
}
export enum EGender {
    MALE = 'MALE',
    FEMALE = 'FEMALE'
}
export enum EActivityLevel {
    SEDENTARY = 'SEDENTARY',
    LIGHTLY_ACTIVE = 'LIGHTLY_ACTIVE',
    MODERATELY_ACTIVE = 'MODERATELY_ACTIVE',
    VERY_ACTIVE = 'VERY_ACTIVE',
}
export enum EHealthGoal {
    WEIGHT_LOSS = 'WEIGHT_LOSS',
    MUSCLE_GAIN = 'MUSCLE_GAIN',
    MAINTENANCE = 'MAINTENANCE',
    IMPROVE_DIGESTION = 'IMPROVE_DIGESTION',
    HEART_HEALTH = 'HEART_HEALTH'
}
export enum EBudgetLevel {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}
export enum ECookingSkill {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED'
}
export interface INutritionTargets {
    targetCalories?: number;
    proteinGr?: number;
    carbsGr?: number;
    fatsGr?: number;
    rationale?: string;
}
export interface IDietaryRestriction {
    type: EDietaryRestrictionType;
    reason: EDietaryRestriction | string;
    notes?: string;
}
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
    nutritionTargets?: INutritionTargets;
    dietaryProfile: {
        preferences: {
            likes: string[];
            dislikes: string[];
        };
        allergies: string[];
        restrictions: IDietaryRestriction[];
        healthNotes?: string;
    };
    cuisinePreferences?: string[];
    budgetLevel?: EBudgetLevel;
    cookingSkill?: ECookingSkill;
    mealFrequency?: number;
    fastingWindow?: string;
}
export interface IGroup {
    readonly id?: string;
    name: string;
    members: IMemberProfile[];
    numberOfPeople: number;
    updatedAt: Date;
    readonly createdAt: Date;
}