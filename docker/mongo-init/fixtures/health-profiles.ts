import { EActivityLevel, EHealthGoal } from '@/interfaces/index.js';
import { IHealthTemplate } from './types.js';

export const HEALTH_PROFILES: Record<string, IHealthTemplate> = {
    WEIGHT_LOSS_ACTIVE: {
        activityLevel: EActivityLevel.VERY_ACTIVE,
        healthGoals: [EHealthGoal.WEIGHT_LOSS, EHealthGoal.HEART_HEALTH],
        weightKg: 85,
        heightCm: 180
    },
    MUSCLE_GAIN: {
        activityLevel: EActivityLevel.MODERATELY_ACTIVE,
        healthGoals: [EHealthGoal.MUSCLE_GAIN, EHealthGoal.IMPROVE_DIGESTION],
        weightKg: 75,
        heightCm: 175
    },
    MAINTENANCE: {
        activityLevel: EActivityLevel.LIGHTLY_ACTIVE,
        healthGoals: [EHealthGoal.MAINTENANCE],
        weightKg: 65,
        heightCm: 165
    },
    RECOVERY: {
        activityLevel: EActivityLevel.LIGHTLY_ACTIVE,
        healthGoals: [EHealthGoal.IMPROVE_DIGESTION, EHealthGoal.HEART_HEALTH],
        weightKg: 70,
        heightCm: 170
    },
    ATHLETE: {
        activityLevel: EActivityLevel.VERY_ACTIVE,
        healthGoals: [EHealthGoal.MUSCLE_GAIN, EHealthGoal.MAINTENANCE],
        weightKg: 80,
        heightCm: 178
    }
};
