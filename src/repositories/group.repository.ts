import { Group, GroupDocument } from '../models/group.model.js';
import { BaseRepository } from './base.repository.js';
import { IGroup, IMemberProfile, IDietaryRestriction } from '../interfaces/index.js';

export class GroupRepository extends BaseRepository<GroupDocument, IGroup> {
    constructor() {
        super(Group);
    }

    protected toInterface(doc: GroupDocument | null): IGroup | null {
        if (!doc) return null;
        return doc.toObject() as unknown as IGroup;
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
        function processUpdate(
            obj: Record<string, any>,
            prefix: string = '',
            depth: number = 0
        ): Record<string, unknown> {
            const fields: Record<string, unknown> = {};
            const MAX_DEPTH = 3; // Basé sur la structure de IMemberProfile

            if (depth >= MAX_DEPTH || !obj || typeof obj !== 'object') {
                fields[prefix] = obj;
                return fields;
            }

            for (const [key, value] of Object.entries(obj)) {
                const fullPath = prefix ? `${prefix}.${key}` : key;
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    Object.assign(fields, processUpdate(value, fullPath, depth + 1));
                } else {
                    fields[fullPath] = value;
                }
            }

            return fields;
        }

        // Transform the update object to use MongoDB's dot notation
        const processedFields = processUpdate(update, 'members.$');

        const doc = await this.model.findOneAndUpdate(
            {
                _id: groupId,
                'members._id': memberId
            },
            {
                $set: {
                    ...processedFields,
                    updatedAt: new Date()
                }
            },
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
