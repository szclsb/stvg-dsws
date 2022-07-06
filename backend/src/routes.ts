import {init as initAuth} from './routes/auth-route'
import {init as initAccount} from './routes/account-route'

import {Application} from "express";
import express from "express";
import {Db} from "mongodb";
import {Config} from "./model/config";

export function init(config: Config, app: Application, db: Db): Application {
    app.use('/api/v1/auth', initAuth(config, express.Router(), db));
    app.use('/api/v1/account', initAccount(config, express.Router(), db));
    return app
}
