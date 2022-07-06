import {init as initAuth} from './routes/auth-route'
import {init as initAccount} from './routes/account-route'

import express, {Application} from "express";
import {Db} from "mongodb";
import {Config} from "./model/config";
import {verifyJwt} from "./utils/auth-utils";

export function init(config: Config, app: Application, db: Db): Application {
    app.use(async (req, res, next) => {
        const auth = req.header('Authorization');
        if (auth && auth.startsWith('Bearer ')) {
            try {
                res.locals.account = await verifyJwt(auth.substring(7), config.secret);
            } catch (e) {
                console.warn(e)
            }
        }
        next();
    });
    app.use('/api/v1/auth', initAuth(config, express.Router(), db));
    app.use('/api/v1/account', initAccount(config, express.Router(), db));
    return app
}
