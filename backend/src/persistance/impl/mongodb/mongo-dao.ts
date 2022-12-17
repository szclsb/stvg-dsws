import {Dao} from "../../dao/dao";
import {ObjectID} from "bson";
import {Collection, Document, WithId as WithDocId} from "mongodb";
import {Entity} from "../../entities/entity";
export type DocumentMapper<E extends Entity> = (doc: WithDocId<Document>) => E
export type ModelMapper<E extends Entity> = (entity: E) => Document

export class MongoDao<E extends Entity> implements Dao<E> {
    protected collection: Collection;
    protected readonly docMapper: DocumentMapper<E>;
    protected readonly modelMapper: ModelMapper<E>;

    public static accountFilter(accountId: string): Document {
        return  {
            $filter: {
                accountId: ObjectID.createFromHexString(accountId)
            }
        }
    }

    public static idFilter(id: string): Document {
        return {
            _id: ObjectID.createFromHexString(id)
        }
    }

    constructor(collection: Collection, docMapper: DocumentMapper<E>, modelMapper: ModelMapper<E>) {
        this.collection = collection;
        this.docMapper = docMapper;
        this.modelMapper = modelMapper;
    }

    async insert(entity: E, accountId?: string): Promise<string> {
        const doc = this.modelMapper(entity);
        if(!!accountId) {
            doc.account = new ObjectID(accountId);
        }
        const result = await this.collection.insertOne(doc);
        return result.insertedId.toHexString();
    }

    // async insertMany(entities: T[], accountId?: string): Promise<string[]> {
    //     const docs = entities.map(model => this.modelMapper(model))
    //     const result = await this.collection.insertMany(docs);
    //     return Object.values(result.insertedIds).map(oid => oid.toHexString());
    // }

    async find(id: string): Promise<E | null> {
        const doc = await this.collection.findOne(MongoDao.idFilter(id)) as WithDocId<Document>;
        return !doc ? null : this.docMapper(doc);
    }

    async findAll(accountId?: string): Promise<E[]> {
        const pipeline: Document[] = [];
        if (!!accountId) {
            pipeline.push(MongoDao.accountFilter(accountId));
        }        const docs = await this.collection.aggregate(pipeline).toArray() as WithDocId<Document>[];
        return docs.map(doc => this.docMapper(doc));
    }

    async update(id: string, entity: E): Promise<any> {
        const doc = this.modelMapper(entity)
        await this.collection.findOneAndUpdate(MongoDao.idFilter(id), {$set: doc});
    }

    async delete(id: string): Promise<any> {
        return await this.collection.findOneAndDelete(MongoDao.idFilter(id));
    }
}
