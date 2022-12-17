import {RegistrationDao} from "../../../dao/registration-dao";
import {ObjectID} from "bson";
import {Db, Document, WithId as WithDocId} from "mongodb";
import {MongoDao} from "../mongo-dao";
import {RegistrationEntity} from "../../../entities/registraion-entity";
import {DisciplineEntity} from "../../../entities/discipline-entity";
import {PersonEntity} from "../../../entities/person-entity";

export class MongoRegistrationDao extends MongoDao<RegistrationEntity> implements RegistrationDao {
    constructor(db: Db) {
        super(db.collection("registrations"), doc => {
            return {
                id: doc._id.toHexString(),
                accountId: doc.accountId.toHexString(),
                disciplineId: doc.disciplineId.toHexString(),
                categoryId: doc.categoryId.toHexString(),
                memberIds: doc.memberIds.map((oid: ObjectID) => oid.toHexString())
            }
        }, entity => {
            const doc: Document = {
                _id: ObjectID.createFromHexString(entity.id),
                accountId: ObjectID.createFromHexString(entity.accountId),
                disciplineId: ObjectID.createFromHexString(entity.disciplineId),
                categoryId: ObjectID.createFromHexString(entity.categoryId),
                memberIds: entity.memberIds.map(memberId => ObjectID.createFromHexString(memberId))
            }
            return doc;
        });
    }

    async findDisciplinesByParticipant(participantId: string): Promise<DisciplineEntity[]> {
        // const docs = await this.collection.aggregate([
        //     {
        //         $match: {
        //             memberIds: {$all: parseId(participantId)}
        //         }
        //
        //     }
        // ]).toArray() as WithDocId<Document>[];
        return Promise.resolve(undefined);
    }

    async findParticipantsByDiscipline(disciplineId: string, categoryId?: string): Promise<PersonEntity[]> {
        // const docs = await this.collection.aggregate([
        //     {
        //         $match: {
        //             disciplineId: parseId(disciplineId)
        //             categoryId: parseId(categoryId)
        //         }
        //     }
        // ]).toArray() as WithDocId<Document>[];
        return Promise.resolve(undefined);
    }

    async findAllByAccountId(accountId: string): Promise<RegistrationEntity[]> {
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
