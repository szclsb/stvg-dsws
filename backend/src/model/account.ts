import {ObjectID} from "bson";

export interface Account {
    username: string;
    email: string;
    roles?: string[];
    address?: Address;
}

export interface Address {
    street: string;
    zipCode: number;
    city: string;
}

export type WithAccount<T> = T & {account: Account | ObjectID};
