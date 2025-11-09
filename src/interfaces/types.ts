import { EDietaryRestrictionType, EDietaryRestriction, EGroupRole, EGender, EActivityLevel, EHealthGoal, EBudgetLevel, ECookingSkill } from './enums.js';

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
  readonly id?: string;
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
  numberOfPeople?: number;
  updatedAt: Date;
  readonly createdAt: Date;
}
