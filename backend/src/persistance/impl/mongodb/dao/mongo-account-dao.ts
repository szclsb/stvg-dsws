import {MongoDao} from "../mongo-dao";
import {AccountDao} from "../../../dao/account-dao";
import {Collection, Db, Document, WithId as WithDocId} from "mongodb";
import {AccountEntity} from "../../../entities/account-entity";

export class MongoAccountDao implements AccountDao {
    private static modelMapper(doc: WithDocId<Document>): AccountEntity {
        return {
            id: doc._id.toHexString(),
            username: doc.username,
            email: doc.email,
            address: doc.address,
            hash: doc.phash,
            roles: doc.roles,
            verified: doc.verified
        };
    }

    private collection: Collection;

    constructor(db: Db) {
        this.collection = db.collection('accounts');
    }

    async insert(entity: AccountEntity): Promise<string> {
        const doc: Document = {
            username: entity.username,
            email: entity.email,
            roles: entity.roles,
            address: entity.address,
        }
        const result = await this.collection.insertOne(doc);
        return result.insertedId.toHexString();
    }

    async findAll(): Promise<AccountEntity[]> {
        const docs = await this.collection.aggregate().toArray() as WithDocId<Document>[];
        return docs.map(doc => MongoAccountDao.modelMapper(doc));
    }

    async find(id: string): Promise<AccountEntity | null> {
        const doc = await this.collection.findOne(MongoDao.idFilter(id)) as WithDocId<Document> | null;
        return !doc ? null :  MongoAccountDao.modelMapper(doc);
    }

    async findByUsername(username: string): Promise<AccountEntity | null> {
        const doc = await this.collection.findOne({username}) as WithDocId<Document> | null;
        return !doc ? null : MongoAccountDao.modelMapper(doc);
    }

    async findByEmail(email: string): Promise<AccountEntity | null> {
        const doc = await this.collection.findOne({email}) as WithDocId<Document> | null;
        return !doc ? null : MongoAccountDao.modelMapper(doc);
    }

    async update(id: string, account: AccountEntity): Promise<any> {
        const doc: Document = {
            username: account.username,
            email: account.email,
            roles: account.roles,
            address: account.address,
        }
        await this.collection.findOneAndUpdate(MongoDao.idFilter(id), [
            {$set: doc}
        ]);
    }

    async delete(id: string): Promise<any> {
        await this.collection.findOneAndDelete(MongoDao.idFilter(id));
    }
}
