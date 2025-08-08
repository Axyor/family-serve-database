import mongoose, { Schema, Document } from 'mongoose';
import {
    EDietaryRestriction,
    EDietaryRestrictionType,
    EGroupRole,
    EGender,
    EActivityLevel,
    EHealthGoal,
    IGroup
} from '../interfaces/index.js';

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
    }
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
    toJSON: {
        transform: (_: any, ret: any) => {
            if (ret._id) {
                const id = ret._id.toString();
                const { _id, ...rest } = ret;
                ret = {
                    ...rest,
                    id
                };
            }
            if (ret.members) {
                ret.members = ret.members.map((member: any) => {
                    if (!member._id) return member;
                    const id = member._id.toString();
                    const { _id, ...rest } = member;
                    return {
                        ...rest,
                        id
                    };
                });
            }
            delete ret.__v;
            return ret;
        }
    },
    toObject: {
        transform: (_: any, ret: any) => {
            if (ret._id) {
                const id = ret._id.toString();
                const { _id, ...rest } = ret;
                ret = {
                    ...rest,
                    id
                };
            }
            if (ret.members) {
                ret.members = ret.members.map((member: any) => {
                    if (!member._id) return member;
                    const id = member._id.toString();
                    const { _id, ...rest } = member;
                    return {
                        ...rest,
                        id
                    };
                });
            }
            delete ret.__v;
            return ret;
        }
    }
});

groupSchema.index({ name: 1 });
memberProfileSchema.index({ firstName: 1, lastName: 1 });

export const Group = mongoose.model<GroupDocument>('Group', groupSchema);
