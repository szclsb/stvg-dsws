import {MongoDao} from "../mongo-dao";
import {WithID} from "../../../dao/dao";
import {DisciplineDao} from "../../../dao/discipline-dao";
import {Discipline} from "../../../../model/discipline";
import {Db, Document, WithId as WithDocId} from "mongodb";

export class MongoDisciplineDaoDao extends MongoDao<Discipline> implements DisciplineDao {
    constructor(db: Db) {
        super(db.collection("disciplines"), doc => {
            const model: WithID<Discipline> = {
                id: doc._id.toHexString(),
                name: doc.name,
                categories: doc.categories,
                minMembers: doc.minMembers,
                maxMembers: doc.maxMembers,
            }
            return model;
        }, t => t as Document);
    }

    findByName(name: string): Promise<WithID<Discipline> | null> {
        return Promise.resolve(undefined);
    }
}
