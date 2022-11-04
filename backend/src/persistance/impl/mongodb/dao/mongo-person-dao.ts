import {PersonDao} from "../../../dao/person-dao";
import {WithID} from "../../../dao/dao";
import {MongoDatasource} from "../mongo-datasource";
import {MongoAccountRelatedDao} from "../mongo-dao-account-related";
import {Person} from "../../../../model/person";
import {Db, Document, WithId as WithDocId} from "mongodb";

export class MongoPersonDao extends MongoAccountRelatedDao<Person> implements PersonDao{
    constructor(db: Db) {
        super(db.collection("disciplines"), doc => {
            const model: WithID<Person> = {
                id: doc._id.toHexString(),
                firstName: doc.firstName,
                lastName: doc.lastName,
                sex: doc.sex,
                yearOfBirth: doc.yearOfBirth
            }
            return model;
        }, t => t as Document);
    }
}
