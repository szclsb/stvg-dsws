import {Address} from "../../model/account";
import {Entity} from "./entity";

export interface AccountEntity extends Entity {
    username: string;
    email: string;
    roles?: string[];
    address?: Address;
    hash: string,
    verified: boolean
}
