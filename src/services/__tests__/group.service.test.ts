import mongoose from 'mongoose';
import { GroupService } from '../group.service';

describe('GroupService', () => {
  let service: GroupService;

  beforeAll(async () => {
    const dbName = `family-serve-test-service-${process.env.JEST_WORKER_ID || '0'}`;
    await mongoose.connect(`mongodb://test_user:test_password@localhost:27017/${dbName}?authSource=admin`);
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

    const all = await service.listGroups();
    expect(all.length).toBe(1);
    expect(all[0].name).toBe('My Family');

    const found = await service.findByName('my family');
    expect(found).not.toBeNull();
    expect(found?.id).toBe(created.id);
  });
});
