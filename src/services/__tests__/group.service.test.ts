import mongoose from 'mongoose';
import { GroupService } from '../group.service.js';
import { EGender, EGroupRole } from '../../interfaces/enums.js';
import { IMemberProfile } from '../../interfaces/types.js';

describe('GroupService', () => {
  let service: GroupService;

  beforeAll(async () => {
    const dbName = `family-serve-test-service-${process.env.JEST_WORKER_ID || '0'}`;
    await mongoose.connect(`mongodb://test_user:test_password@localhost:27018/${dbName}?authSource=admin`);
    service = new GroupService();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  it('should create, list and find group by name', async () => {
    const created = await service.createGroup('My Family');
    expect(created).toBeDefined();
    expect(created.name).toBe('My Family');
  expect(created.numberOfPeople).toBe(0);

    const all = await service.listGroups();
    expect(all.length).toBe(1);
    expect(all[0].name).toBe('My Family');
  expect(all[0].numberOfPeople).toBe(0);

    const found = await service.findByName('my family');
    expect(found).not.toBeNull();
    expect(found?.id).toBe(created.id);
  expect(found?.numberOfPeople).toBe(0);
  });

  it('should handle numberOfPeople virtual operations', async () => {
    const group = await service.createGroup('Test Family');
    expect(group.numberOfPeople).toBe(0);

    const memberData: Omit<IMemberProfile, 'id'> = {
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      gender: EGender.MALE,
      role: EGroupRole.ADMIN,
      dietaryProfile: {
        preferences: { likes: [], dislikes: [] },
        allergies: [],
        restrictions: []
      }
    };

    const groupWithMember = await service.addMember(group.id!, memberData);
    expect(groupWithMember).not.toBeNull();
    expect(groupWithMember!.numberOfPeople).toBe(1);

  const refreshed = await service.getGroup(group.id!);
  expect(refreshed?.numberOfPeople).toBe(1);
  });
});
