import mongoose from 'mongoose';
import { GroupService } from '../group.service.js';
import { EGender, EGroupRole, EDietaryRestrictionType, EDietaryRestriction } from '../../interfaces/enums.js';

describe('GroupService Domain Integration', () => {
  let service: GroupService;

  beforeAll(async () => {
    const dbName = `family-serve-test-domain-${process.env.JEST_WORKER_ID || '0'}`;
    await mongoose.connect(`mongodb://test_user:test_password@localhost:27017/${dbName}?authSource=admin`);
    service = new GroupService();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should summarize members by restriction via entity layer', async () => {
    const g = await service.createGroup('DomainFam');
    await service.addMember(g.id!, {
      role: EGroupRole.MEMBER,
      firstName: 'Anna', lastName: 'One', age: 25, gender: EGender.FEMALE,
      dietaryProfile: { preferences: { likes: [], dislikes: [] }, allergies: [], restrictions: [
        { type: EDietaryRestrictionType.FORBIDDEN, reason: EDietaryRestriction.GLUTEN_FREE }
      ] }
    });
    await service.addMember(g.id!, {
      role: EGroupRole.MEMBER,
      firstName: 'Ben', lastName: 'Two', age: 30, gender: EGender.MALE,
      dietaryProfile: { preferences: { likes: [], dislikes: [] }, allergies: [], restrictions: [] }
    });

    const summary = await service.findMembersByRestriction(g.id!, EDietaryRestrictionType.FORBIDDEN, EDietaryRestriction.GLUTEN_FREE);
    expect(summary).not.toBeNull();
    expect(summary!.totalMembers).toBe(2);
    expect(summary!.filteredCount).toBe(1);
    expect(summary!.members[0].firstName).toBe('Anna');
  });
});
