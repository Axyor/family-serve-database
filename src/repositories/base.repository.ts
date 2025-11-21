import { Document, Model, UpdateQuery } from 'mongoose';
export abstract class BaseRepository<TDocument extends Document, TInterface> {
    constructor(protected readonly model: Model<TDocument>) { }

    protected abstract toInterface(doc: TDocument | null): TInterface | null;

    async findById(id: string): Promise<TInterface | null> {
        const doc = await this.model.findById(id);
        return this.toInterface(doc);
    }

    async findAll(): Promise<TInterface[]> {
        const docs = await this.model.find();
        return docs.map(doc => this.toInterface(doc)).filter((item): item is TInterface => item !== null);
    }

    async create(data: Partial<TInterface>): Promise<TInterface> {
        const entity = new this.model(data as unknown);
        const doc = await entity.save();
        const result = this.toInterface(doc);
        if (!result) throw new Error('Failed to create entity');
        return result;
    }

    async update(id: string, data: Partial<TInterface>): Promise<TInterface | null> {
        const doc = await this.model.findByIdAndUpdate(id, data as unknown as UpdateQuery<TDocument>, { new: true });
        return this.toInterface(doc as unknown as TDocument);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id);
        return result !== null;
    }
}
