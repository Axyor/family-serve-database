import { GroupRepository } from '../repositories/group.repository.js';
import { IGroup, IMemberProfile } from '../interfaces/index.js';

export class GroupService {
    private repository: GroupRepository;

    constructor() {
        this.repository = new GroupRepository();
    }

    async createGroup(name: string): Promise<IGroup> {
        return this.repository.create({ name });
    }

    async getGroup(id: string): Promise<IGroup | null> {
        return this.repository.findById(id);
    }

    async addMember(groupId: string, member: Omit<IMemberProfile, 'id'>): Promise<IGroup | null> {
        return this.repository.addMember(groupId, member);
    }

    async updateMember(groupId: string, memberId: string, update: Partial<IMemberProfile>): Promise<IGroup | null> {
        return this.repository.updateMember(groupId, memberId, update);
    }

    async removeMember(groupId: string, memberId: string): Promise<IGroup | null> {
        return this.repository.removeMember(groupId, memberId);
    }
}
