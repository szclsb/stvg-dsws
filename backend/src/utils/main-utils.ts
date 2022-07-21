import {ObjectID} from "bson";

export type WithId<T> = T  & { _id?: ObjectID };
export type EntityMapper<T> = (body: any) => T;
