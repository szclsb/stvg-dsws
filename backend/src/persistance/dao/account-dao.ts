import {Dao} from "./dao";
import {AccountEntity} from "../entities/account-entity";

export interface AccountDao extends Dao<AccountEntity> {
    findByUsername(username: string): Promise<AccountEntity | null>;
    findByEmail(email: string): Promise<AccountEntity | null>;
}
