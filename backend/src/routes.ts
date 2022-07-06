import {init as initAuth} from './routes/auth-route'
import {init as initAccount} from './routes/account-route'

import {Application} from "express";
import express from "express";
import {Db} from "mongodb";

export function init(app: Application, db: Db): Application {
    app.use('/api/v1/auth', initAuth(express.Router(), db));
    app.use('/api/v1/account', initAccount(express.Router(), db));
    return app
}
