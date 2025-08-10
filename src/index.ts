import mongoose from 'mongoose';
import { GroupService } from './services/group.service.js';
export * from './interfaces/index.js';
export * from './config/index.js';

export class Database {
    private static instance: Database;
    private groupService: GroupService;

    private constructor() {
        this.groupService = new GroupService();
    }

    static async initialize(mongoUri: string): Promise<Database> {
        if (!Database.instance) {
            await mongoose.connect(mongoUri);
            Database.instance = new Database();
        }
        return Database.instance;
    }

    static getInstance(): Database {
        if (!Database.instance) {
            throw new Error('Database not initialized. Call Database.initialize() first.');
        }
        return Database.instance;
    }

    getGroupService(): GroupService {
        return this.groupService;
    }

    async disconnect(): Promise<void> {
        await mongoose.disconnect();
    }
}

export default Database;
