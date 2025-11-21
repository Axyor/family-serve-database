import { GroupRepository } from '../repositories/group.repository.js';
import { IGroup, IMemberProfile, IDietaryRestriction } from '../interfaces/types.js';
import { EHealthGoal } from '../interfaces/enums.js';
import { GroupCreateSchema, MemberProfileCreateSchema } from '../interfaces/validation.js';
import { logger } from '../utils/logger.js';
import { GroupEntity } from '../domain/group.entity.js';
export class GroupService {
    private repository: GroupRepository;

    constructor() {
        this.repository = new GroupRepository();
    }

    async createGroup(name: string): Promise<IGroup> {
        const parsed = GroupCreateSchema.parse({ name });
        logger.debug({ name: parsed.name }, 'Creating group');
        return this.repository.create({ name: parsed.name });
    }

    async listGroups(): Promise<IGroup[]> {
        return this.repository.findAll();
    }

    async getGroup(id: string): Promise<IGroup | null> {
        return this.repository.findById(id);
    }

    async findByName(name: string): Promise<IGroup | null> {
        return this.repository.findByName(name);
    }

    async addMember(groupId: string, member: Omit<IMemberProfile, 'id'>): Promise<IGroup | null> {
        const parsedRaw = MemberProfileCreateSchema.parse(member);
        const parsed: Omit<IMemberProfile, 'id'> = {
            ...parsedRaw
        } as unknown as Omit<IMemberProfile, 'id'>;
        logger.debug({ groupId, member: parsed.firstName }, 'Adding member');
        return this.repository.addMember(groupId, parsed);
    }

    async updateMember(groupId: string, memberId: string, update: Partial<IMemberProfile>): Promise<IGroup | null> {
        return this.repository.updateMember(groupId, memberId, update);
    }

    async removeMember(groupId: string, memberId: string): Promise<IGroup | null> {
        return this.repository.removeMember(groupId, memberId);
    }

    async updateMemberRestrictions(
        groupId: string,
        memberId: string,
        restrictions: IDietaryRestriction[]
    ): Promise<IGroup | null> {
        return this.repository.updateMemberRestrictions(groupId, memberId, restrictions);
    }

    async addMemberRestriction(
        groupId: string,
        memberId: string,
        restriction: IDietaryRestriction
    ): Promise<IGroup | null> {
        return this.repository.addMemberRestriction(groupId, memberId, restriction);
    }

    async removeMemberRestriction(
        groupId: string,
        memberId: string,
        restrictionId: string
    ): Promise<IGroup | null> {
        return this.repository.removeMemberRestriction(groupId, memberId, restrictionId);
    }

    async updateMemberMetrics(
        groupId: string,
        memberId: string,
        weightKg?: number,
        heightCm?: number
    ): Promise<IGroup | null> {
        const update: Partial<IMemberProfile> = {};
        if (weightKg !== undefined) update.weightKg = weightKg;
        if (heightCm !== undefined) update.heightCm = heightCm;
        return this.repository.updateMember(groupId, memberId, update);
    }

    async updateMemberHealthGoals(
        groupId: string,
        memberId: string,
        goals: EHealthGoal[]
    ): Promise<IGroup | null> {
        return this.repository.updateMember(groupId, memberId, { healthGoals: goals });
    }

    async updateMemberAllergies(
        groupId: string,
        memberId: string,
        allergies: string[]
    ): Promise<IGroup | null> {
        const group = await this.getGroup(groupId);
        if (!group) return null;

        const member = group.members.find(m => m.id === memberId);
        if (!member) return null;

        return this.repository.updateMember(groupId, memberId, {
            dietaryProfile: {
                ...member.dietaryProfile,
                allergies
            }
        });
    }

    async findMembersByRestriction(
        groupId: string,
        restrictionType: IDietaryRestriction['type'],
        reason?: IDietaryRestriction['reason']
    ): Promise<{
        groupId: string;
        name: string;
        totalMembers: number;
        filteredCount: number;
        members: IMemberProfile[];
    } | null> {
        const group = await this.repository.findById(groupId);
        if (!group) return null;
        const entity = new GroupEntity(group);
        return entity.summaryByRestriction(restrictionType, reason);
    }
}
