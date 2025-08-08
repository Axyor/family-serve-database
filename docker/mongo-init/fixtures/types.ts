import {
    EGender,
    EGroupRole,
    EActivityLevel,
    EHealthGoal,
    IDietaryRestriction,
} from '@/interfaces/index.js';

export interface IMemberTemplate {
    role: EGroupRole;
    gender: EGender;
    age: number;
}

export interface IHealthTemplate {
    activityLevel: EActivityLevel;
    healthGoals: EHealthGoal[];
    weightKg: number;
    heightCm: number;
}

export interface IDietaryTemplate {
    preferences: {
        likes: string[];
        dislikes: string[];
    };
    allergies: string[];
    restrictions: IDietaryRestriction[];
    healthNotes: string;
}

export interface IFixtures {
    FAMILY_MEMBERS: Record<string, IMemberTemplate>;
    HEALTH_PROFILES: Record<string, IHealthTemplate>;
    DIETARY_PROFILES: Record<string, IDietaryTemplate>;
}
