import mongoose, { Schema, Document } from 'mongoose';
import { transformWithId } from '../utils/transform.js';
import { getNameSearchCollation } from '../config/index.js';
import {
    EDietaryRestriction,
    EDietaryRestrictionType,
    EGroupRole,
    EGender,
    EActivityLevel,
    EHealthGoal,
    EBudgetLevel,
    ECookingSkill
} from '../interfaces/enums.js';
import { IGroup } from '../interfaces/types.js';

export interface MemberProfileDocument extends Document {
    _id: mongoose.Types.ObjectId;
    id: string;
}

const memberProfileSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose.Types.ObjectId()
    },
    role: {
        type: String,
        enum: Object.values(EGroupRole),
        required: true,
        default: EGroupRole.MEMBER
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 0
    },
    gender: {
        type: String,
        enum: Object.values(EGender),
        required: true
    },
    weightKg: {
        type: Number,
        min: 0
    },
    heightCm: {
        type: Number,
        min: 0
    },
    activityLevel: {
        type: String,
        enum: Object.values(EActivityLevel)
    },
    healthGoals: [{
        type: String,
        enum: Object.values(EHealthGoal),
        trim: true
    }],
    nutritionTargets: {
        targetCalories: { type: Number, min: 0 },
        proteinGr: { type: Number, min: 0 },
        carbsGr: { type: Number, min: 0 },
        fatsGr: { type: Number, min: 0 },
        rationale: { type: String, trim: true }
    },
    dietaryProfile: {
        preferences: {
            likes: [{
                type: String,
                trim: true
            }],
            dislikes: [{
                type: String,
                trim: true
            }]
        },
        allergies: [{
            type: String,
            trim: true
        }],
        restrictions: [{
            type: {
                type: String,
                enum: Object.values(EDietaryRestrictionType),
                required: true
            },
            reason: {
                type: Schema.Types.Mixed,
                required: true,
                validate: {
                    validator: function (v: any) {
                        return typeof v === 'string' || Object.values(EDietaryRestriction).includes(v);
                    },
                    message: 'reason must be either a string or a valid EDietaryRestriction value'
                }
            },
            notes: {
                type: String,
                trim: true
            }
        }],
        healthNotes: {
            type: String,
            trim: true
        }
    },
    cuisinePreferences: [{ type: String, trim: true }],
    budgetLevel: { type: String, enum: Object.values(EBudgetLevel) },
    cookingSkill: { type: String, enum: Object.values(ECookingSkill) },
    mealFrequency: { type: Number, min: 1, max: 10 },
    fastingWindow: { type: String, trim: true }
}, {
    toJSON: {
        transform: (_: any, ret: any) => {
            if (ret._id) {
                const { _id, ...rest } = ret;
                ret = {
                    ...rest,
                    id: _id.toString()
                };
            }
            delete ret.__v;
            return ret;
        }
    },
    toObject: {
        transform: (_: any, ret: any) => {
            if (ret._id) {
                const { _id, ...rest } = ret;
                ret = {
                    ...rest,
                    id: _id.toString()
                };
            }
            delete ret.__v;
            return ret;
        }
    }
});

export interface GroupDocument extends Document, Omit<IGroup, 'id'> {
    _id: mongoose.Types.ObjectId;
    id: string;
}

const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    members: [memberProfileSchema]
}, {
    timestamps: true,
    toJSON: { transform: (_: any, ret: any) => transformWithId(ret) },
    toObject: { transform: (_: any, ret: any) => transformWithId(ret) }
});

groupSchema.virtual('numberOfPeople').get(function (this: any) {
    return this.members ? this.members.length : 0;
});

const __nameIndexCollation = getNameSearchCollation();
groupSchema.index(
    { name: 1 },
    __nameIndexCollation
        ? { name: 'idx_group_name_collated', collation: __nameIndexCollation }
        : { name: 'idx_group_name' }
);
memberProfileSchema.index({ firstName: 1, lastName: 1 });

export const Group = mongoose.model<GroupDocument>('Group', groupSchema);
