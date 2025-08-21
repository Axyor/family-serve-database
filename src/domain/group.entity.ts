import { IGroup, IDietaryRestriction } from '../interfaces/types.js';
import { MemberEntity } from './member.entity.js';

export class GroupEntity {
  constructor(private data: IGroup) {}

  get id() { return this.data.id!; }
  get name() { return this.data.name; }
  get members(): MemberEntity[] { return this.data.members.map(m => new MemberEntity(m)); }
  get raw(): IGroup { return this.data; }
  get numberOfPeople(): number { return this.data.numberOfPeople ?? this.data.members.length; }

  filterMembersByRestriction(type: IDietaryRestriction['type'], reason?: IDietaryRestriction['reason']): MemberEntity[] {
    return this.members.filter(m => m.hasRestriction(type, reason));
  }

  summaryByRestriction(type: IDietaryRestriction['type'], reason?: IDietaryRestriction['reason']) {
    const filtered = this.filterMembersByRestriction(type, reason);
    return {
      groupId: this.id,
      name: this.name,
      totalMembers: this.numberOfPeople,
      filteredCount: filtered.length,
      members: filtered.map(m => m.profile)
    };
  }
}
