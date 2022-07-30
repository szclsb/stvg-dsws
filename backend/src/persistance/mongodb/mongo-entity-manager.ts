import {EntityManager, Selector, WithID} from "../entity-manager";
import {ObjectID} from "bson";
import {Collection, Document, FindOptions} from "mongodb";

// export type DocumentMapper<T> = (doc: WithMongoId<Document>) => WithID<T, ObjectID>

export class MongoEntityManager<T> implements EntityManager<T, ObjectID> {
    private collection: Collection;

    constructor(collection: Collection) {
        this.collection = collection;
    }

    async insertOne(entity: T): Promise<ObjectID> {
        const result = await this.collection.insertOne(entity);
        return result.insertedId;
    }

    async insertMany(entities: T[]): Promise<ObjectID[]> {
        const result = await this.collection.insertMany(entities);
        return Object.values(result.insertedIds);
    }

    async findOne<R = T>(filter: Selector, projection?: Selector): Promise<WithID<R, ObjectID>> {
        const options: FindOptions = {};
        if(projection) {
            options.projection = projection as Document;
        }
        const doc = await this.collection.findOne(filter as Document, options);
        return doc as WithID<R, ObjectID>
    }

    async findMany<R = T>(filter?: Selector, projection?: Selector): Promise<WithID<R, ObjectID>[]> {
        const pipeline: Document[] = [];
        if (filter) {
            pipeline.push({$filter: filter as Document})
        }
        if (projection) {
            pipeline.push({$project: projection as Document})
        }
        const docs = await this.collection.aggregate(pipeline).toArray();
        return docs.map(doc => doc as WithID<R, ObjectID>);
    }

    async updateOne(filter: Selector, entity: T): Promise<any> {
        await this.collection.updateOne(filter as Document, {$set: entity});
    }

    async updateMany(filter: Selector, entity: T): Promise<any> {
        await this.collection.updateMany(filter as Document, {$set: entity});
    }

    async deleteOne(filter: Selector): Promise<any> {
        return await this.collection.deleteOne(filter as Document);
    }

    async deleteMany(filter: Selector): Promise<any> {
        return await this.collection.deleteMany(filter as Document);
    }
}
