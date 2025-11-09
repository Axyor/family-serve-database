import mongoose from 'mongoose';
import { GroupRepository } from '../group.repository';
import { EGender, EGroupRole } from '../../interfaces/enums.js';
import { IMemberProfile } from '../../interfaces/types.js';

describe('GroupRepository Concurrency', () => {
  let repository: GroupRepository;

  beforeAll(async () => {
    const dbName = `family-serve-test-repo-conc-${process.env.JEST_WORKER_ID || '0'}`;
    await mongoose.connect(`mongodb://test_user:test_password@localhost:27017/${dbName}?authSource=admin`);
    repository = new GroupRepository();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
  });

  it('should handle concurrent addMember operations correctly', async () => {
    const group = await repository.create({ name: 'Conc Family' });
    const base: Omit<IMemberProfile, 'id'> = {
      firstName: 'A',
      lastName: 'B',
      age: 10,
      gender: EGender.MALE,
      role: EGroupRole.MEMBER,
      dietaryProfile: { preferences: { likes: [], dislikes: [] }, allergies: [], restrictions: [] }
    };

    const tasks = Array.from({ length: 5 }).map((_, i) =>
      repository.addMember(group.id!, { ...base, firstName: `Fn${i}`, lastName: `Ln${i}` })
    );

  await Promise.all(tasks);
    const final = await repository.findById(group.id!);
    expect(final).not.toBeNull();
    expect(final!.members.length).toBe(5);
    expect(final!.numberOfPeople).toBe(5);
  });

  it('should not update member when fields outside whitelist provided', async () => {
    const group = await repository.create({ name: 'Whitelist Test' });
    const added = await repository.addMember(group.id!, {
      firstName: 'John', lastName: 'Doe', age: 20, gender: EGender.MALE, role: EGroupRole.MEMBER,
      dietaryProfile: { preferences: { likes: [], dislikes: [] }, allergies: [], restrictions: [] }
    });
    const memberId = added!.members[0].id;
    expect(memberId).toBeDefined();

    const after = await repository.updateMember(group.id!, memberId!, {
      someRandomField: 'ignored' as any,
      firstName: 'Johnny'
    } as any);

    expect(after!.members[0].firstName).toBe('Johnny');
  expect((after!.members[0] as any).someRandomField).toBeUndefined();
  });
});
