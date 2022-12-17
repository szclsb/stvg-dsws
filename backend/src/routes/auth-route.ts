import {Router} from "express";
import {Config} from "../model/config";
import {Account} from "../model/account";
import {AccountService} from "../service/account-service";
import {AuthService} from "../service/auth-service";
import {createResponse, readResponse} from "../utils/route-utils";

export function init(config: Config, router: Router, accountService: AccountService, authService: AuthService): Router {
    router.post("/register", (req, res) => {
        const registration = req.body as Account & {password: string}
        createResponse(authService.register(registration), `api/v1/accounts`, req, res);
    });

    router.post("/login", (req, res) => {
        const cred = req.body as {
            username: string
            password: string
        }
        readResponse(authService.login(cred.username, cred.password), req, res);
    });

    console.debug(`initialized route auth`);
    return router;
}
