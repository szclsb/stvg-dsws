import {MongoDao} from "../mongo-dao";
import {DisciplineDao} from "../../../dao/discipline-dao";
import {Discipline} from "../../../../model/discipline";
import {WithID} from "../../../../model/models";
import {Db} from "mongodb";
import {DisciplineEntity} from "../../../entities/discipline-entity";
import {ObjectID} from "bson";

export class MongoDisciplineDaoDao extends MongoDao<DisciplineEntity> implements DisciplineDao {
    constructor(db: Db) {
        super(db.collection("disciplines"), doc => {
            return  {
                id: doc._id.toHexString(),
                name: doc.name,
                categories: doc.categories,
                minMembers: doc.minMembers,
                maxMembers: doc.maxMembers,
            }
        }, entity => {
            return {
                _id: ObjectID.createFromHexString(entity.id),
                name: entity.name,
                categories: entity.categories,
                minMembers: entity.minMembers,
                maxMembers: entity.maxMembers,
            }
        });
    }

    findByName(name: string): Promise<WithID<Discipline> | null> {
        return Promise.resolve(undefined);
    }
}
