import {Dao, ReadAccountDao} from "./dao"
import {RegistrationEntity} from "../entities/registraion-entity";
import {PersonEntity} from "../entities/person-entity";
import {DisciplineEntity} from "../entities/discipline-entity";

export interface RegistrationDao extends Dao<RegistrationEntity>, ReadAccountDao<RegistrationEntity> {
    findParticipantsByDiscipline(disciplineId: string, categoryId?: string, accountId?: string): Promise<PersonEntity[]>
    findDisciplinesByParticipant(participantId: string, accountId?: string): Promise<DisciplineEntity[]>
}
