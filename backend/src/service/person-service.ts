import {PersonDao} from "../persistance/dao/person-dao";
import {Person} from "../model/person";
import {Account} from "../model/account";
import {WithID} from "../model/models";
import {PersonEntity} from "../persistance/entities/person-entity";
import {HttpError} from "../http-error";

function mapper(entity: PersonEntity): WithID<Person> {
    return {
        id: entity.id,
        firstName: entity.firstName,
        lastName: entity.lastName,
        sex: entity.sex,
        yearOfBirth: entity.yearOfBirth
    }
}

export class PersonService {
    private dao: PersonDao;

    constructor(dao: PersonDao) {
        this.dao = dao;
    }

    public async create(owner: WithID<Account>, person: Person): Promise<number> {
        return await this.dao.insert({
            accountId: owner.id,
            firstName: person.firstName,
            lastName: person.lastName,
            sex: person.sex,
            yearOfBirth: person.yearOfBirth
        });
    }

    public async findAll(): Promise<WithID<Person>[]> {
        const entities = await this.dao.findAll();
        return entities.map(entity => mapper(entity));
    }

    public async findAllByAccount(account: WithID<Account>): Promise<WithID<Person>[]> {
        const entities = await this.dao.findAllByAccountId(account.id);
        return entities.map(entity => mapper(entity));
    }

    public async findById(id: number, preCheck?: (accountId?: number) => any): Promise<WithID<Person>> {
        const entity = await this.dao.find(id);
        if (entity == null) {
            throw new HttpError(HttpError.NOT_FOUND, `No person found with id ${id}`);
        }
        preCheck?.(entity.accountId);
        return mapper(entity);
    }

    public async findAndUpdate(id: number, person: Person, preCheck?: (accountId?: number) => any): Promise<any> {
        const entity = await this.dao.find(id);
        if (entity == null) {
            throw new HttpError(HttpError.NOT_FOUND, `No person found with id ${id}`);
        }
        preCheck?.(entity.accountId);
        await this.dao.update(id, {
            firstName: person.firstName,
            lastName: person.lastName,
            sex: person.sex,
            yearOfBirth: person.yearOfBirth
        });
    }

    public async findAndDelete(id: number, preCheck?: (accountId?: number) => any): Promise<any> {
        const entity = await this.dao.find(id);
        if (entity == null) {
            throw new HttpError(HttpError.NOT_FOUND, `No person found with id ${id}`);
        }
        preCheck?.(entity.accountId);
        await this.dao.delete(id);
    }
}
