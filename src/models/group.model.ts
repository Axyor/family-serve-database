import mongoose, { Schema, Document } from 'mongoose';
import { EDietaryRestriction, EGroupRole, EGender, EActivityLevel, IMemberProfile, IGroup } from '../interfaces/index.js';

export interface MemberProfileDocument extends Document, Omit<IMemberProfile, 'id'> {
    _id: mongoose.Types.ObjectId;
}

const memberProfileSchema = new Schema({
    id: {
        type: String,
        required: true,
        default: () => new mongoose.Types.ObjectId().toString()
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
    _id: false,
    toJSON: {
        transform: (_, ret) => {
            delete ret.__v;
            return ret;
        }
    }
});

export interface GroupDocument extends Document, Omit<IGroup, '_id'> {
    _id: mongoose.Types.ObjectId;
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
    toJSON: {
        transform: (_, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

groupSchema.index({ name: 1 });
memberProfileSchema.index({ firstName: 1, lastName: 1 });

export const Group = mongoose.model<GroupDocument>('Group', groupSchema);
