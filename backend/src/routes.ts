import {init as initAuth} from './routes/auth-route'
import {init as initAccount} from './routes/account-route'
import {init as initDiscipline} from './routes/discipline-route'
import {init as initPerson} from './routes/person-route'
import {init as initRegistration} from './routes/registration-route'

import express, {Application} from "express";
import {Config} from "./model/config";
import {verifyJwt} from "./utils/auth-utils";
import {Datasource} from "./persistance/datasource";
import {ObjectID} from "bson";
import {Account, WithAccount} from "./model/account";
import {Discipline} from "./model/discipline";
import {Person} from "./model/person";
import {Registration} from "./model/registraion";

export function init(config: Config, app: Application, datasource: Datasource<ObjectID>): Application {
    const accountManager = datasource.createEntityManager<Account>('account');
    const disciplineManager = datasource.createEntityManager<Discipline>('discipline');
    const personManager = datasource.createEntityManager<WithAccount<Person>>('person');
    const registrationManager = datasource.createEntityManager<WithAccount<Registration>>('registration');

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

    app.use('/api/v1/auth', initAuth(config, express.Router(), accountManager));
    app.use('/api/v1/account', initAccount(config, express.Router(), accountManager));
    app.use('/api/v1/discipline', initDiscipline(config, express.Router(), disciplineManager));
    app.use('/api/v1/persons', initPerson(config, express.Router(), personManager));
    app.use('/api/v1/registration', initRegistration(config, express.Router(), registrationManager));
    return app
}
