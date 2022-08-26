export type WithID<T, ID> = T & {_id: ID}
export type EntityMapper<T> = (body: any) => T;

export interface Selector {
    [key: string]: any;
}

export interface EntityManager<T, ID> {
    insertOne(entity: T): Promise<ID>;
    insertMany(entity: T[]): Promise<ID[]>;
    findOne<R = T>(filter: Selector, projection?: Selector): Promise<WithID<R, ID> | null>;
    findMany<R = T> (filter?: Selector, projection?: Selector): Promise<WithID<R, ID>[]>
    updateOne(filter: Selector, entity: T): Promise<any>;
    updateMany(filter: Selector, entity: T): Promise<any>;
    deleteOne(filter: Selector): Promise<any>;
    deleteMany(filter: Selector): Promise<any>;
}
