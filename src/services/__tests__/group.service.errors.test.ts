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
});
