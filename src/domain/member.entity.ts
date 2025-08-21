import { IMemberProfile, IDietaryRestriction } from '../interfaces/types.js';

export class MemberEntity {
  constructor(private readonly data: IMemberProfile) {}

  get id() { return this.data.id; }
  get firstName() { return this.data.firstName; }
  get lastName() { return this.data.lastName; }
  get profile(): IMemberProfile { return this.data; }

  hasRestriction(type: IDietaryRestriction['type'], reason?: IDietaryRestriction['reason']): boolean {
    return this.data.dietaryProfile.restrictions.some(r => r.type === type && (!reason || r.reason === reason));
  }
}
