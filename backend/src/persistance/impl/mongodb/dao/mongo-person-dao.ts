import {PersonDao} from "../../../dao/person-dao";
import {Db, Document, WithId as WithDocId} from "mongodb";
import {MongoDao} from "../mongo-dao";
import {PersonEntity} from "../../../entities/person-entity";
import {ObjectID} from "bson";

export class MongoPersonDao extends MongoDao<PersonEntity> implements PersonDao {
    constructor(db: Db) {
        super(db.collection("persons"), doc => {
            return  {
                id: doc._id.toHexString(),
                firstName: doc.firstName,
                lastName: doc.lastName,
                sex: doc.sex,
                yearOfBirth: doc.yearOfBirth
            }
        }, entity => {
            return {
                _id: ObjectID.createFromHexString(entity.id),
                firstName: entity.firstName,
                lastName: entity.lastName,
                sex: entity.sex,
                yearOfBirth: entity.yearOfBirth
            }
        });
    }

    async findAllByAccountId(accountId: string): Promise<PersonEntity[]> {
        const docs = await this.collection.aggregate([
            {
                $match: {
                    accountId: ObjectID.createFromHexString(accountId)
                }
            }
        ]).toArray() as WithDocId<Document>[];
        return docs.map(doc => this.docMapper(doc));
    }
}
