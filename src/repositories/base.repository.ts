import { Document, Model } from 'mongoose';

/**
 * Base repository providing common CRUD operations for Mongoose models.
 * @typeParam TDocument - The Mongoose document type
 * @typeParam TInterface - The public interface returned by the repository
 */
export abstract class BaseRepository<TDocument extends Document, TInterface> {
    /**
     * Creates a new instance bound to a Mongoose model.
     * @param model The Mongoose model for the entity
     */
    constructor(protected readonly model: Model<TDocument>) { }

    /**
     * Converts a Mongoose document to the public interface.
     * Implementations must handle nulls.
     * @param doc The Mongoose document
     * @returns The mapped interface or null
     */
    protected abstract toInterface(doc: TDocument | null): TInterface | null;

    /**
     * Finds an entity by its id.
     * @param id The entity id
     * @returns The entity or null if not found
     */
    async findById(id: string): Promise<TInterface | null> {
        const doc = await this.model.findById(id);
        return this.toInterface(doc);
    }

    /**
     * Retrieves all entities.
     * @returns Array of entities (empty if none found)
     */
    async findAll(): Promise<TInterface[]> {
        const docs = await this.model.find();
        return docs.map(doc => this.toInterface(doc)).filter((item): item is TInterface => item !== null);
    }

    /**
     * Creates a new entity.
     * @param data Partial entity data used to initialize the document
     * @returns The created entity
     * @throws Error if creation fails to produce a valid interface
     */
    async create(data: Partial<TInterface>): Promise<TInterface> {
        const entity = new this.model(data as any);
        const doc = await entity.save();
        const result = this.toInterface(doc);
        if (!result) throw new Error('Failed to create entity');
        return result;
    }

    /**
     * Updates an entity by id.
     * @param id The entity id
     * @param data Partial data to update
     * @returns The updated entity or null
     */
    async update(id: string, data: Partial<TInterface>): Promise<TInterface | null> {
        const doc = await this.model.findByIdAndUpdate(id, data as any, { new: true });
        return this.toInterface(doc);
    }

    /**
     * Deletes an entity by id.
     * @param id The entity id
     * @returns True if an entity was deleted, false otherwise
     */
    async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id);
        return result !== null;
    }
}
