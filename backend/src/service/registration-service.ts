import {Account} from "../model/account";
import {RegistrationDao} from "../persistance/dao/registration-dao";
import {Registration} from "../model/registraion";
import {WithID} from "../model/models";
import {RegistrationEntity} from "../persistance/entities/registraion-entity";
import {HttpError} from "../http-error";

function mapper(entity: RegistrationEntity): WithID<Registration> {
    return {
        id: entity.id,
        discipline: entity.disciplineId,
        category: entity.categoryId,
        member: entity.memberIds
    }
}

export class RegistrationService {
    private dao: RegistrationDao;

    constructor(dao: RegistrationDao) {
        this.dao = dao;
    }

    public async create(owner: WithID<Account>, registration: Registration): Promise<string> {
        return await this.dao.insert({
            accountId: owner.id,
            disciplineId: registration.discipline,
            categoryId: registration.category,
            memberIds: registration.member
        });
    }

    public async findAll(): Promise<WithID<Registration>[]> {
        const entities = await this.dao.findAll();
        return  entities.map(entity => mapper(entity));
    }

    public async findAllByAccount(account: WithID<Account>): Promise<WithID<Registration>[]> {
        const entities = await this.dao.findAllByAccountId(account.id);
        return entities.map(entity => mapper(entity));
    }

    public async findById(id: string, preCheck?: (accountId?: string) => any): Promise<WithID<Registration> | null> {
        const entity = await this.dao.find(id);
        if (entity == null) {
            throw new HttpError(HttpError.NOT_FOUND ,`No registration found with id ${id}`);
        }
        preCheck?.(entity.accountId);
        return mapper(entity);
    }

    public async findAndUpdate(id: string, registration: Registration, preCheck?: (accountId?: string) => any) {
        const entity = await this.dao.find(id);
        if (entity == null) {
            throw new HttpError(HttpError.NOT_FOUND, `No registration found with id ${id}`);
        }
        preCheck?.(entity.accountId);
        await this.dao.update(id, {
            disciplineId: registration.discipline,
            categoryId: registration.category,
            memberIds: registration.member
        });
    }

    public async findAndDelete(id: string, preCheck?: (accountId?: string) => any) {
        const entity = await this.dao.find(id);
        if (entity == null) {
            throw new HttpError(HttpError.NOT_FOUND, `No registration found with id ${id}`);
        }
        preCheck(entity.accountId)
        await this.dao.delete(id);
    }
}
