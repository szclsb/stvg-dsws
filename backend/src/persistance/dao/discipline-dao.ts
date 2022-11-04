import {Dao} from "./dao"
import {DisciplineEntity} from "../entities/discipline-entity";

export interface DisciplineDao extends Dao<DisciplineEntity> {
    findByName(name: string): Promise<DisciplineEntity | null>
}
