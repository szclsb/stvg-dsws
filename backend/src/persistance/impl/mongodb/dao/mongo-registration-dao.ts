import {WithID} from "../../../dao/dao";
import {MongoDatasource} from "../mongo-datasource";
import {MongoAccountRelatedDao} from "../mongo-dao-account-related";
import {Person} from "../../../../model/person";
import {Registration} from "../../../../model/registraion";
import {RegistrationDao} from "../../../dao/registration-dao";
import {Discipline} from "../../../../model/discipline";
import {ObjectID} from "bson";
import {Db, Document, WithId as WithDocId} from "mongodb";

export class MongoRegistrationDao extends MongoAccountRelatedDao<Registration> implements RegistrationDao {
    constructor(db: Db) {
        super(db.collection("disciplines"), doc => {
            const model: WithID<Registration> = {
                id: doc._id.toHexString(),
                discipline: doc.discipline?.toHexString(),
                category: doc.category?.toHexString(),
                member: doc.member.map((oid: ObjectID) => oid.toHexString())
            }
            return model;
        }, entity => {
            const doc: Document = {
                discipline: new ObjectID(entity.discipline),
                category: new ObjectID(entity.category),
                member: entity.member.map(memberId => new ObjectID(memberId))
            }
            return doc;
        });
    }

    findDisciplinesByParticipant(participantId: string): Promise<WithID<Discipline[]>> {
        // todo
        return Promise.resolve(undefined);
    }

    findParticipantsByDiscipline(disciplineId: string, categoryId?: string): Promise<WithID<Person[]>> {
        // todo
        return Promise.resolve(undefined);
    }
}
