import { z } from 'zod';
import { EDietaryRestrictionType, EDietaryRestriction, EGroupRole, EGender, EActivityLevel, EHealthGoal, EBudgetLevel, ECookingSkill } from './enums.js';

const enumValues = <T extends Record<string, string>>(e: T) => Object.values(e) as [string, ...string[]];

export const DietaryRestrictionSchema = z.object({
  type: z.enum(enumValues(EDietaryRestrictionType)),
  reason: z.union([
    z.enum(enumValues(EDietaryRestriction)),
    z.string().min(1).max(200)
  ]),
  notes: z.string().trim().max(200).optional()
});

export const NutritionTargetsSchema = z.object({
  targetCalories: z.number().int().positive().optional(),
  proteinGr: z.number().int().nonnegative().optional(),
  carbsGr: z.number().int().nonnegative().optional(),
  fatsGr: z.number().int().nonnegative().optional(),
  rationale: z.string().trim().max(500).optional()
});

export const MemberProfileCreateSchema = z.object({
  role: z.enum(enumValues(EGroupRole)),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  age: z.number().int().nonnegative(),
  gender: z.enum(enumValues(EGender)),
  weightKg: z.number().positive().optional(),
  heightCm: z.number().positive().optional(),
  activityLevel: z.enum(enumValues(EActivityLevel)).optional(),
  healthGoals: z.array(z.enum(enumValues(EHealthGoal))).optional(),
  nutritionTargets: NutritionTargetsSchema.optional(),
  dietaryProfile: z.object({
    preferences: z.object({
      likes: z.array(z.string().trim().max(100)).max(50),
      dislikes: z.array(z.string().trim().max(100)).max(50)
    }),
    allergies: z.array(z.string().trim().max(100)).max(50),
    restrictions: z.array(DietaryRestrictionSchema),
    healthNotes: z.string().trim().max(500).optional()
  }),
  cuisinePreferences: z.array(z.string().trim().max(100)).max(20).optional(),
  budgetLevel: z.enum(enumValues(EBudgetLevel)).optional(),
  cookingSkill: z.enum(enumValues(ECookingSkill)).optional(),
  mealFrequency: z.number().int().min(1).max(10).optional(),
  fastingWindow: z.string().trim().max(50).optional()
});

export const GroupCreateSchema = z.object({
  name: z.string().trim().min(1).max(100),
  members: z.array(MemberProfileCreateSchema).optional()
});

export type TMemberProfileCreate = z.infer<typeof MemberProfileCreateSchema>;
export type TGroupCreate = z.infer<typeof GroupCreateSchema>;
