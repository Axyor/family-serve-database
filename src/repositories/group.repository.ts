import { Group, GroupDocument } from '../models/group.model.js';
import { BaseRepository } from './base.repository.js';
import { IGroup, IMemberProfile } from '../interfaces/index.js';

export class GroupRepository extends BaseRepository<GroupDocument, IGroup> {
    constructor() {
        super(Group);
    }

    protected toInterface(doc: GroupDocument | null): IGroup | null {
        if (!doc) return null;
        const { _id, name, members, createdAt, updatedAt } = doc.toJSON();
        return {
            _id: _id.toString(),
            name,
            members: members.map((m: any) => ({
                ...m,
                _id: m._id.toString()
            })) as IMemberProfile[],
            createdAt,
            updatedAt
        };
    }

    async addMember(groupId: string, member: Omit<IMemberProfile, 'id'>): Promise<IGroup | null> {
        const doc = await this.model.findByIdAndUpdate(
            groupId,
            {
                $push: { members: member },
                $set: { updatedAt: new Date() }
            },
            { new: true }
        );
        return this.toInterface(doc);
    }

    async updateMember(groupId: string, memberId: string, update: Partial<IMemberProfile>): Promise<IGroup | null> {
        const doc = await this.model.findOneAndUpdate(
            {
                _id: groupId,
                'members._id': memberId
            },
            {
                $set: Object.entries(update).reduce((acc, [key, value]) => ({
                    ...acc,
                    [`members.$.${key}`]: value
                }), {}),
                updatedAt: new Date()
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
}
