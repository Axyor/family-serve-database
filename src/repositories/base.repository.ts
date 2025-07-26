import mongoose from 'mongoose';
import { IGroup, IMemberProfile } from '../interfaces/index.js';

export abstract class BaseRepository<T> {
    constructor(protected readonly model: mongoose.Model<T>) { }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id);
    }

    async findAll(): Promise<T[]> {
        return this.model.find();
    }

    async create(data: Partial<T>): Promise<T> {
        const entity = new this.model(data);
        return entity.save();
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id);
        return result !== null;
    }
}
