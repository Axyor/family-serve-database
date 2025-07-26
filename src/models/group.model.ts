import mongoose from 'mongoose';
import { EDietaryRestriction, EGroupRole, EGender, EActivityLevel } from '../interfaces/index.js';

const memberProfileSchema = new mongoose.Schema({
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
    activityLevel: {
        type: String,
        enum: Object.values(EActivityLevel)
    },
    healthGoals: [{
        type: String,
        trim: true
    }],
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
            type: String,
            enum: Object.values(EDietaryRestriction)
        }],
        healthNotes: {
            type: String,
            trim: true
        }
    }
}, {
    _id: true,
    timestamps: false
});

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    members: [memberProfileSchema]
}, {
    timestamps: true
});

// Indices
groupSchema.index({ name: 1 });
memberProfileSchema.index({ firstName: 1, lastName: 1 });

export const Group = mongoose.model('Group', groupSchema);
export const MemberProfile = mongoose.model('MemberProfile', memberProfileSchema);
