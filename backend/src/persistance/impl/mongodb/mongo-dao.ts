import {Dao} from "../../dao/dao";
import {ObjectID} from "bson";
import {Collection, Db, Document, WithId as WithDocId} from "mongodb";
import {WithID} from "../../../model/models";

export type DocumentMapper<T> = (doc: WithDocId<Document>) => WithID<T>
export type ModelMapper<T> = (t: T) => Document

export class MongoDao<T> implements Dao<T> {
    protected collection: Collection;
    protected readonly docMapper: DocumentMapper<T>;
    protected readonly modelMapper: ModelMapper<T>;

    public static accountFilter(accountId: number): Document {
        return  {
            $filter: {
                accountId: MongoDao.parseId(accountId)
            }
        }
    }

    public static idFilter(id: number): Document {
        return {
            _id: MongoDao.parseId(id)
        }
    }

    public static parseId(id: number): ObjectID {
        const buf = Buffer.alloc(4);
        buf.writeUInt32LE(id);
        return new ObjectID(buf);
    }

    public static objectIdNum(objectId: ObjectID): number {
        return objectId.id.readUInt32LE(0);
    }

    constructor(collection: Collection, docMapper: DocumentMapper<T>, modelMapper: ModelMapper<T>) {
        this.collection = collection;
        this.docMapper = docMapper;
        this.modelMapper = modelMapper;
    }

    async insert(entity: T, accountId?: string): Promise<number> {
        const doc = this.modelMapper(entity);
        if(!!accountId) {
            doc.account = new ObjectID(accountId);
        }
        const result = await this.collection.insertOne(doc);
        return MongoDao.objectIdNum(result.insertedId);
    }

    // async insertMany(entities: T[], accountId?: string): Promise<string[]> {
    //     const docs = entities.map(model => this.modelMapper(model))
    //     const result = await this.collection.insertMany(docs);
    //     return Object.values(result.insertedIds).map(oid => oid.toHexString());
    // }

    async find(id: number): Promise<WithID<T> | null> {
        const doc = await this.collection.findOne(MongoDao.idFilter(id)) as WithDocId<Document>;
        return this.docMapper(doc);
    }

    async findAll(accountId?: number): Promise<WithID<T>[]> {
        const pipeline: Document[] = [];
        if (!!accountId) {
            pipeline.push(MongoDao.accountFilter(accountId));
        }        const docs = await this.collection.aggregate(pipeline).toArray() as WithDocId<Document>[];
        return docs.map(doc => this.docMapper(doc));
    }

    async update(id: number, entity: T): Promise<any> {
        const doc = this.modelMapper(entity)
        await this.collection.findOneAndUpdate(MongoDao.idFilter(id), {$set: doc});
    }

    async delete(id: number): Promise<any> {
        return await this.collection.findOneAndDelete(MongoDao.idFilter(id));
    }
}
