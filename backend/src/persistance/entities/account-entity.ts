import {Address} from "../../model/account";

export interface AccountEntity {
    id?: number;
    username: string;
    email: string;
    roles?: string[];
    address?: Address;
    hash: string,
    verified: boolean
}
