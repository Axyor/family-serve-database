import { EDietaryRestriction, EDietaryRestrictionType } from '@/interfaces/index.js';
import { IDietaryTemplate } from './types.js';

export const DIETARY_PROFILES: Record<string, IDietaryTemplate> = {
    GLUTEN_FREE_HIGH_PROTEIN: {
        preferences: {
            likes: ["Quinoa", "Salmon", "Avocado", "Chicken", "Rice"],
            dislikes: ["Mushrooms", "Cilantro"]
        },
        allergies: ["Peanuts"],
        restrictions: [
            {
                type: EDietaryRestrictionType.FORBIDDEN,
                reason: EDietaryRestriction.GLUTEN_FREE,
                notes: "Celiac disease"
            }
        ],
        healthNotes: "Needs high-protein meals"
    },
    VEGETARIAN_LACTOSE_INTOLERANT: {
        preferences: {
            likes: ["Kale", "Sweet Potato", "Berries", "Tofu", "Legumes"],
            dislikes: ["Red Meat"]
        },
        allergies: ["Shellfish", "Dairy"],
        restrictions: [
            {
                type: EDietaryRestrictionType.FORBIDDEN,
                reason: EDietaryRestriction.DAIRY_FREE,
                notes: "Severe lactose intolerance"
            }
        ],
        healthNotes: "Prefers plant-based meals"
    },
    ATHLETE_BULKING: {
        preferences: {
            likes: ["Chicken", "Rice", "Broccoli", "Eggs", "Protein Shakes"],
            dislikes: ["Spicy Food"]
        },
        allergies: [],
        restrictions: [],
        healthNotes: "Building muscle mass"
    },
    LOW_CARB_KETO: {
        preferences: {
            likes: ["Avocado", "Eggs", "Cheese", "Nuts", "Fish"],
            dislikes: ["Sugar", "Bread"]
        },
        allergies: [],
        restrictions: [
            {
                type: EDietaryRestrictionType.REDUCED,
                reason: EDietaryRestriction.LOW_CARB,
                notes: "Following ketogenic diet"
            }
        ],
        healthNotes: "Maintaining ketosis"
    },
    FOOD_ALLERGIES: {
        preferences: {
            likes: ["Rice", "Vegetables", "Fruit"],
            dislikes: ["Processed Foods"]
        },
        allergies: ["Peanuts", "Tree Nuts", "Eggs", "Soy"],
        restrictions: [
            {
                type: EDietaryRestrictionType.FORBIDDEN,
                reason: "Multiple severe allergies",
                notes: "Multiple food allergies, requires careful meal planning"
            }
        ],
        healthNotes: "Multiple food allergies, carries EpiPen"
    }
};
