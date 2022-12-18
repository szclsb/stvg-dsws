import {hashPassword, signJwt, verifyJwt, verifyPassword} from "../utils/auth-utils";
import {AccountDao} from "../persistance/dao/account-dao";
import {Account} from "../model/account";
import {HttpError} from "../http-error";


export class AuthService {
    private readonly secret: string;
    private readonly dao: AccountDao;

    constructor(secret: string, dao: AccountDao) {
        this.secret = secret;
        this.dao = dao;
    }

    public async register(registration: Account & {password: string}): Promise<string> {
        const hash = await hashPassword(registration.password);
        return await this.dao.insert({
            username: registration.username,
            email: registration.email,
            address: registration.address,
            hash,
            verified: false,
            roles: []
        });
    }

    public async login(username: string, password: string): Promise<string> {
        const accountEntity = await this.dao.findByUsername(username);
        const result = await verifyPassword(password, accountEntity?.hash);
        if (result) {
            return signJwt(accountEntity, this.secret);
        }
        throw new HttpError(400, `Invalid credentials`);
    }

    public async verify(token?: string): Promise<Account | undefined> {
        return !token ? undefined : await verifyJwt(token?.substring(7), this.secret);
    }
}
