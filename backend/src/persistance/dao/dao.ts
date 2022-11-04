export interface ReadDao<E> {
    find(id: number): Promise<E | null>;
    findAll(): Promise<E[]>
}

export interface ReadAccountDao<E> {
    findAllByAccountId(accountId: number): Promise<E[]>
}

export interface WriteDao<E> {
    insert(entity: E): Promise<number>;
    // insertMany(entity: T[], accountId?: string): Promise<string[]>;
    update(id: number, entity: E): Promise<any>;
    // updateMany(data: [id: string, entity: T][]): Promise<any>;
    delete(id: number): Promise<any>;
    // deleteMany(ids: string[]): Promise<any>;
}

export type Dao<E> = ReadDao<E> & WriteDao<E>;
