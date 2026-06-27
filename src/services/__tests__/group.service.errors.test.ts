import mongoose from 'mongoose';
import { GroupService } from '../group.service.js';
import { EGender, EGroupRole } from '../../interfaces/enums.js';

describe('GroupService Errors & Validation', () => {
  let service: GroupService;

  beforeAll(async () => {
    const dbName = `family-serve-test-service-errors-${process.env.JEST_WORKER_ID || '0'}`;
    await mongoose.connect(`mongodb://test_user:test_password@localhost:27018/${dbName}?authSource=admin`);
    service = new GroupService();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should reject invalid group name', async () => {
    await expect(service.createGroup(''))
      .rejects.toThrow();
  });

  it('should reject invalid member (missing fields)', async () => {
    const g = await service.createGroup('ValGroup');
    await expect(service.addMember(g.id!, { } as any)).rejects.toThrow();
  });

  it('should accept valid member', async () => {
    const g = await service.createGroup('Another');
    const added = await service.addMember(g.id!, {
      role: EGroupRole.MEMBER,
      firstName: 'John',
      lastName: 'Doe',
      age: 22,
      gender: EGender.MALE,
      dietaryProfile: { preferences: { likes: [], dislikes: [] }, allergies: [], restrictions: [] }
    });
    expect(added?.members.length).toBe(1);
  });

  it('should reject group name exceeding 100 chars', async () => {
    await expect(service.createGroup('X'.repeat(101))).rejects.toThrow();
  });

  it('should reject firstName exceeding 100 chars', async () => {
    const g = await service.createGroup('LimitsGroup');
    await expect(service.addMember(g.id!, {
      role: EGroupRole.MEMBER,
      firstName: 'A'.repeat(101),
      lastName: 'Doe',
      age: 25,
      gender: EGender.MALE,
      dietaryProfile: { preferences: { likes: [], dislikes: [] }, allergies: [], restrictions: [] }
    })).rejects.toThrow();
  });

  it('should reject allergies array exceeding 50 items', async () => {
    const g = await service.createGroup('ArrayLimits');
    await expect(service.addMember(g.id!, {
      role: EGroupRole.MEMBER,
      firstName: 'John',
      lastName: 'Doe',
      age: 25,
      gender: EGender.MALE,
      dietaryProfile: {
        preferences: { likes: [], dislikes: [] },
        allergies: Array.from({ length: 51 }, (_, i) => `Allergy${i}`),
        restrictions: []
      }
    })).rejects.toThrow();
  });
});
