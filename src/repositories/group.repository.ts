import { Group } from '../models/group.model.js';
import { BaseRepository } from './base.repository.js';
import { IGroup, IMemberProfile } from '../interfaces/index.js';

export class GroupRepository extends BaseRepository<IGroup> {
    constructor() {
        super(Group);
    }

    async addMember(groupId: string, member: Omit<IMemberProfile, 'id'>): Promise<IGroup | null> {
        return this.model.findByIdAndUpdate(
            groupId,
            {
                $push: { members: member },
                $set: { updatedAt: new Date() }
            },
            { new: true }
        );
    }

    async updateMember(groupId: string, memberId: string, update: Partial<IMemberProfile>): Promise<IGroup | null> {
        return this.model.findOneAndUpdate(
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
    }

    async removeMember(groupId: string, memberId: string): Promise<IGroup | null> {
        return this.model.findByIdAndUpdate(
            groupId,
            {
                $pull: { members: { _id: memberId } },
                $set: { updatedAt: new Date() }
            },
            { new: true }
        );
    }
}
