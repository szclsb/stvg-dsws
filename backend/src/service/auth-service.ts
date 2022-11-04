import {signJwt, verifyJwt, verifyPassword} from "../utils/auth-utils";
import {AccountDao} from "../persistance/dao/account-dao";
import {Account} from "../model/account";


export class AuthService {
    private readonly secret: string;
    private readonly dao: AccountDao;

    constructor(secret: string, dao: AccountDao) {
        this.secret = secret;
        this.dao = dao;
    }

    public async login(username: string, password: string): Promise<string | null> {
        const accountEntity = await this.dao.findByUsername(username);
        const result = await verifyPassword(password, accountEntity?.hash);
        if (result) {
            return signJwt(accountEntity, this.secret);
        }
        return null;
    }

    public async verify(token?: string): Promise<Account> {
        return await verifyJwt(token?.substring(7), this.secret);
    }
}
