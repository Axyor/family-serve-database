import { Group, GroupDocument } from '../models/group.model.js';
import { BaseRepository } from './base.repository.js';
import { IMemberProfile, IDietaryRestriction, IGroup } from '../interfaces/types.js';
import { getNameSearchCollation } from '../config/index.js';
export class GroupRepository extends BaseRepository<GroupDocument, IGroup> {
    constructor() {
        super(Group);
    }

    protected toInterface(doc: GroupDocument | null): IGroup | null {
        if (!doc) return null;
        return doc.toObject() as unknown as IGroup;
    }

    async findByName(name: string): Promise<IGroup | null> {
        const query = this.model.findOne({ name });
        const collation = getNameSearchCollation();
        if (collation) {
            query.collation(collation as any);
        }
        const doc = await query;
        return this.toInterface(doc);
    }

    async addMember(groupId: string, member: Omit<IMemberProfile, 'id'>): Promise<IGroup | null> {
        const doc = await this.model.findOneAndUpdate(
            { _id: groupId },
            {
                $push: { members: member },
                $set: { updatedAt: new Date() }
            },
            { new: true }
        );
        return this.toInterface(doc);
    }

    async updateMember(groupId: string, memberId: string, update: Partial<IMemberProfile>): Promise<IGroup | null> {
        const whitelist: (keyof IMemberProfile)[] = [
            'firstName', 'lastName', 'age', 'gender', 'weightKg', 'heightCm', 'activityLevel',
            'healthGoals', 'nutritionTargets', 'dietaryProfile', 'cuisinePreferences', 'budgetLevel',
            'cookingSkill', 'mealFrequency', 'fastingWindow'
        ];

        const setOps: Record<string, any> = {};
        for (const key of whitelist) {
            const value = (update as any)[key];
            if (value === undefined) continue;
            if (key === 'dietaryProfile' && value) {
                // Replace subfields atomically
                if (value.preferences) {
                    if (value.preferences.likes)
                        setOps['members.$.dietaryProfile.preferences.likes'] = value.preferences.likes;
                    if (value.preferences.dislikes)
                        setOps['members.$.dietaryProfile.preferences.dislikes'] = value.preferences.dislikes;
                }
                if (value.allergies) setOps['members.$.dietaryProfile.allergies'] = value.allergies;
                if (value.restrictions) setOps['members.$.dietaryProfile.restrictions'] = value.restrictions;
                if (value.healthNotes !== undefined) setOps['members.$.dietaryProfile.healthNotes'] = value.healthNotes;
                continue;
            }
            setOps[`members.$.${key}`] = value;
        }
        if (Object.keys(setOps).length === 0) {
            return this.findById(groupId);
        }
        setOps['updatedAt'] = new Date();
        const doc = await this.model.findOneAndUpdate(
            { _id: groupId, 'members._id': memberId },
            { $set: setOps },
            { new: true }
        );
        return this.toInterface(doc);
    }

    async removeMember(groupId: string, memberId: string): Promise<IGroup | null> {
        const doc = await this.model.findByIdAndUpdate(
            groupId,
            {
                $pull: { members: { _id: memberId } },
                $set: { updatedAt: new Date() }
            },
            { new: true }
        );
        return this.toInterface(doc);
    }

    async updateMemberRestrictions(
        groupId: string,
        memberId: string,
        restrictions: IDietaryRestriction[]
    ): Promise<IGroup | null> {
        const doc = await this.model.findOneAndUpdate(
            {
                _id: groupId,
                'members._id': memberId
            },
            {
                $set: {
                    'members.$.dietaryProfile.restrictions': restrictions,
                    updatedAt: new Date()
                }
            },
            { new: true }
        );
        return this.toInterface(doc);
    }

    async addMemberRestriction(
        groupId: string,
        memberId: string,
        restriction: IDietaryRestriction
    ): Promise<IGroup | null> {
        const doc = await this.model.findOneAndUpdate(
            {
                _id: groupId,
                'members._id': memberId
            },
            {
                $push: { 'members.$.dietaryProfile.restrictions': restriction },
                $set: { updatedAt: new Date() }
            },
            { new: true }
        );
        return this.toInterface(doc);
    }

    async removeMemberRestriction(
        groupId: string,
        memberId: string,
        restrictionId: string
    ): Promise<IGroup | null> {
        const doc = await this.model.findOneAndUpdate(
            {
                _id: groupId,
                'members._id': memberId
            },
            {
                $pull: { 'members.$.dietaryProfile.restrictions': { _id: restrictionId } },
                $set: { updatedAt: new Date() }
            },
            { new: true }
        );
        return this.toInterface(doc);
    }

    async updateMemberAllergies(
        groupId: string,
        memberId: string,
        allergies: string[]
    ): Promise<IGroup | null> {
        const doc = await this.model.findOneAndUpdate(
            {
                _id: groupId,
                'members._id': memberId
            },
            {
                $set: {
                    'members.$.dietaryProfile.allergies': allergies,
                    updatedAt: new Date()
                }
            },
            { new: true }
        );
        return this.toInterface(doc);
    }

    async addMemberAllergy(
        groupId: string,
        memberId: string,
        allergy: string
    ): Promise<IGroup | null> {
        const doc = await this.model.findOneAndUpdate(
            {
                _id: groupId,
                'members._id': memberId
            },
            {
                $push: { 'members.$.dietaryProfile.allergies': allergy },
                $set: { updatedAt: new Date() }
            },
            { new: true }
        );
        return this.toInterface(doc);
    }

    async removeMemberAllergy(
        groupId: string,
        memberId: string,
        allergy: string
    ): Promise<IGroup | null> {
        const doc = await this.model.findOneAndUpdate(
            {
                _id: groupId,
                'members._id': memberId
            },
            {
                $pull: { 'members.$.dietaryProfile.allergies': allergy },
                $set: { updatedAt: new Date() }
            },
            { new: true }
        );
        return this.toInterface(doc);
    }
}
