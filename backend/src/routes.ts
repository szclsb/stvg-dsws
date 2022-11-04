import {init as initAuth} from './routes/auth-route'
import {init as initAccount} from './routes/account-route'
import {init as initDiscipline} from './routes/discipline-route'
import {init as initPerson} from './routes/person-route'
import {init as initRegistration} from './routes/registration-route'

import express, {Application} from "express";
import {Config} from "./model/config";
import {Datasource} from "./persistance/datasource";
import {AccountDao} from "./persistance/dao/account-dao";
import {DisciplineDao} from "./persistance/dao/discipline-dao";
import {PersonDao} from "./persistance/dao/person-dao";
import {RegistrationDao} from "./persistance/dao/registration-dao";

export function init(config: Config, app: Application, datasource: Datasource): Application {
    const accountManager: AccountDao = datasource.createAccountDao();
    const disciplineManager: DisciplineDao = datasource.createDisciplineDao();
    const personManager: PersonDao = datasource.createPersonDao();
    const registrationManager: RegistrationDao = datasource.createRegistrationDao();

    app.use(async (req, res, next) => {
        const auth = req.header('Authorization');
        if (auth && auth.startsWith('Bearer ')) {
            try {
                res.locals.account =
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
