import {AccountIdEntity, Entity} from "../entities/entity";

export interface ReadDao<E extends Entity> {
    find(id: string): Promise<E | null>;
    findAll(): Promise<E[]>
}

export interface ReadAccountDao<E extends AccountIdEntity> {
    findAllByAccountId(accountId: string): Promise<E[]>
}

export interface WriteDao<E extends Entity> {
    insert(entity: E): Promise<string>;
    // insertMany(entity: T[], accountId?: string): Promise<string[]>;
    update(id: string, entity: E): Promise<any>;
    // updateMany(data: [id: string, entity: T][]): Promise<any>;
    delete(id: string): Promise<any>;
    // deleteMany(ids: string[]): Promise<any>;
}

export type Dao<X> = ReadDao<X> & WriteDao<X>;
