import {Dao, ReadAccountDao} from "./dao"
import {PersonEntity} from "../entities/person-entity";

export interface PersonDao extends Dao<PersonEntity>, ReadAccountDao<PersonEntity> {
}
