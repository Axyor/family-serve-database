import { z } from 'zod';
import { EDietaryRestrictionType, EDietaryRestriction, EGroupRole, EGender, EActivityLevel, EHealthGoal, EBudgetLevel, ECookingSkill } from './enums.js';

const enumValues = <T extends Record<string,string>>(e:T)=> Object.values(e) as [string, ...string[]];

export const DietaryRestrictionSchema = z.object({
  type: z.enum(enumValues(EDietaryRestrictionType) as any),
  reason: z.union([
    z.enum(enumValues(EDietaryRestriction) as any),
    z.string().min(1)
  ]),
  notes: z.string().trim().optional()
});

export const NutritionTargetsSchema = z.object({
  targetCalories: z.number().int().positive().optional(),
  proteinGr: z.number().int().nonnegative().optional(),
  carbsGr: z.number().int().nonnegative().optional(),
  fatsGr: z.number().int().nonnegative().optional(),
  rationale: z.string().trim().optional()
});

export const MemberProfileCreateSchema = z.object({
  role: z.enum(enumValues(EGroupRole) as any),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  age: z.number().int().nonnegative(),
  gender: z.enum(enumValues(EGender) as any),
  weightKg: z.number().positive().optional(),
  heightCm: z.number().positive().optional(),
  activityLevel: z.enum(enumValues(EActivityLevel) as any).optional(),
  healthGoals: z.array(z.enum(enumValues(EHealthGoal) as any)).optional(),
  nutritionTargets: NutritionTargetsSchema.optional(),
  dietaryProfile: z.object({
    preferences: z.object({
      likes: z.array(z.string().trim()),
      dislikes: z.array(z.string().trim())
    }),
    allergies: z.array(z.string().trim()),
    restrictions: z.array(DietaryRestrictionSchema),
    healthNotes: z.string().trim().optional()
  }),
  cuisinePreferences: z.array(z.string().trim()).optional(),
  budgetLevel: z.enum(enumValues(EBudgetLevel) as any).optional(),
  cookingSkill: z.enum(enumValues(ECookingSkill) as any).optional(),
  mealFrequency: z.number().int().min(1).max(10).optional(),
  fastingWindow: z.string().trim().optional()
});

export const GroupCreateSchema = z.object({
  name: z.string().trim().min(1),
  members: z.array(MemberProfileCreateSchema).optional()
});

export type TMemberProfileCreate = z.infer<typeof MemberProfileCreateSchema>;
export type TGroupCreate = z.infer<typeof GroupCreateSchema>;
