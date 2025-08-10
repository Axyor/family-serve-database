import { GroupRepository } from '../repositories/group.repository.js';
import { IGroup, IMemberProfile, IDietaryRestriction, EHealthGoal } from '../interfaces/index.js';

/**
 * Service for managing family groups and their members
 */
export class GroupService {
    private repository: GroupRepository;

    constructor() {
        this.repository = new GroupRepository();
    }

    /**
     * Creates a new group with the given name
     * @param name The name of the group to create
     * @returns The newly created group
     */
    async createGroup(name: string): Promise<IGroup> {
        return this.repository.create({ name });
    }

    /**
     * Lists all groups
     */
    async listGroups(): Promise<IGroup[]> {
        return this.repository.findAll();
    }

    /**
     * Retrieves a group by its ID
     * @param id The ID of the group to retrieve
     * @returns The group if found, null otherwise
     */
    async getGroup(id: string): Promise<IGroup | null> {
        return this.repository.findById(id);
    }

    /**
     * Finds a group by its name
     */
    async findByName(name: string): Promise<IGroup | null> {
        return this.repository.findByName(name);
    }

    /**
     * Adds a new member to a group
     * @param groupId The ID of the group to add the member to
     * @param member The member profile to add (without ID as it will be generated)
     * @returns The updated group if successful, null otherwise
     */
    async addMember(groupId: string, member: Omit<IMemberProfile, 'id'>): Promise<IGroup | null> {
        return this.repository.addMember(groupId, member);
    }

    /**
     * Updates a member's profile in a group
     * @param groupId The ID of the group containing the member
     * @param memberId The ID of the member to update
     * @param update The partial member profile with fields to update
     * @returns The updated group if successful, null otherwise
     */
    async updateMember(groupId: string, memberId: string, update: Partial<IMemberProfile>): Promise<IGroup | null> {
        return this.repository.updateMember(groupId, memberId, update);
    }

    /**
     * Removes a member from a group
     * @param groupId The ID of the group containing the member
     * @param memberId The ID of the member to remove
     * @returns The updated group if successful, null otherwise
     */
    async removeMember(groupId: string, memberId: string): Promise<IGroup | null> {
        return this.repository.removeMember(groupId, memberId);
    }

    /**
     * Updates all dietary restrictions for a member
     * @param groupId The ID of the group containing the member
     * @param memberId The ID of the member whose restrictions to update
     * @param restrictions Array of dietary restrictions to set for the member
     * @returns The updated group if successful, null otherwise
     */
    async updateMemberRestrictions(
        groupId: string,
        memberId: string,
        restrictions: IDietaryRestriction[]
    ): Promise<IGroup | null> {
        return this.repository.updateMemberRestrictions(groupId, memberId, restrictions);
    }

    /**
     * Adds a new dietary restriction to a member's profile
     * @param groupId The ID of the group containing the member
     * @param memberId The ID of the member to add the restriction to
     * @param restriction The dietary restriction to add
     * @returns The updated group if successful, null otherwise
     */
    async addMemberRestriction(
        groupId: string,
        memberId: string,
        restriction: IDietaryRestriction
    ): Promise<IGroup | null> {
        return this.repository.addMemberRestriction(groupId, memberId, restriction);
    }

    /**
     * Removes a specific dietary restriction from a member's profile
     * @param groupId The ID of the group containing the member
     * @param memberId The ID of the member whose restriction to remove
     * @param restrictionId The ID of the restriction to remove
     * @returns The updated group if successful, null otherwise
     */
    async removeMemberRestriction(
        groupId: string,
        memberId: string,
        restrictionId: string
    ): Promise<IGroup | null> {
        return this.repository.removeMemberRestriction(groupId, memberId, restrictionId);
    }

    /**
     * Updates the physical metrics of a member
     * @param groupId The ID of the group containing the member
     * @param memberId The ID of the member to update
     * @param weightKg Optional weight in kilograms
     * @param heightCm Optional height in centimeters
     * @returns The updated group if successful, null otherwise
     */
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

    /**
     * Updates a member's health goals
     * @param groupId The ID of the group containing the member
     * @param memberId The ID of the member to update
     * @param goals Array of health goals to set
     * @returns The updated group if successful, null otherwise
     */
    async updateMemberHealthGoals(
        groupId: string,
        memberId: string,
        goals: EHealthGoal[]
    ): Promise<IGroup | null> {
        return this.repository.updateMember(groupId, memberId, { healthGoals: goals });
    }

    /**
     * Updates a member's allergies while preserving other dietary profile data
     * @param groupId The ID of the group containing the member
     * @param memberId The ID of the member to update
     * @param allergies Array of allergy descriptions
     * @returns The updated group if successful, null otherwise
     */
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

    /**
     * Finds members in a group by their dietary restriction type and optionally by reason
     * @param groupId The ID of the group to search in
     * @param restrictionType The type of restriction to search for (FORBIDDEN or REDUCED)
     * @param reason Optional. The specific reason to filter by (e.g., specific allergy or diet type)
     * @returns A group object containing only members with matching restrictions, or null if group not found
     * @example
     * // Find all members with forbidden restrictions (allergies)
     * const allergicMembers = await service.findMembersByRestriction(groupId, 'FORBIDDEN');
     * 
     * // Find vegetarian members
     * const vegetarians = await service.findMembersByRestriction(groupId, 'REDUCED', 'VEGETARIAN');
     */
    async findMembersByRestriction(
        groupId: string,
        restrictionType: IDietaryRestriction['type'],
        reason?: IDietaryRestriction['reason']
    ): Promise<IGroup | null> {
        const group = await this.repository.findById(groupId);
        if (!group) return null;

        const filteredMembers = group.members.filter(member =>
            member.dietaryProfile.restrictions.some(restriction =>
                restriction.type === restrictionType &&
                (!reason || restriction.reason === reason)
            )
        );

        return {
            ...group,
            members: filteredMembers
        };
    }
}
