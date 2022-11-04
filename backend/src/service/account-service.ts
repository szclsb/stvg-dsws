import {WithID} from "../model/models";
import {Account} from "../model/account";
import {hashPassword} from "../utils/auth-utils";
import {AccountDao} from "../persistance/dao/account-dao";
import {AccountEntity} from "../persistance/entities/account-entity";
import {HttpError} from "../http-error";

function mapper(entity: AccountEntity): WithID<Account> {
    return {
        id: entity.id!,
        username: entity.username,
        email: entity.email,
        address: entity.address,
        roles: entity.roles
    }
}

export class AccountService {
    private dao: AccountDao;

    constructor(dao: AccountDao) {
        this.dao = dao;
    }

    public async register(account: Account, password: string): Promise<number> {
        const hash = await hashPassword(password);
        return await this.dao.insert({
            username: account.username,
            email: account.email,
            address: account.address,
            hash,
            verified: false,
            roles: []
        });
    }

    public async findById(id: number): Promise<WithID<Account>> {
        const entity = await this.dao.find(id);
        if (entity == null) {
            throw new HttpError(HttpError.NOT_FOUND ,`No account found with id ${id}`);
        }
        return mapper(entity);
    }

    public async findByUsername(username: string): Promise<WithID<Account>> {
        const entity = await this.dao.findByUsername(username);
        if (entity == null) {
            throw new HttpError(HttpError.NOT_FOUND ,`No account found with username ${username}`);
        }
        return mapper(entity);
    }

    public async findAll(): Promise<WithID<Account>[]> {
        const entities = await this.dao.findAll();
        return entities.map(entity => mapper(entity));
    }

    public async update(id: number, account: Account): Promise<any> {
        return;
    }

    public async updatePassword(id: number, passwordOld: string, passwordNew: string): Promise<any> {
        return;
    }

    public async delete(id: number): Promise<any> {
        return await this.dao.delete(id);
    }
}
