import {init as initAuth} from './routes/auth-route'
import {init as initAccount} from './routes/account-route'
import {init as initDiscipline} from './routes/discipline-route'
import {init as initPerson} from './routes/person-route'
import {init as initRegistration} from './routes/registration-route'

import express, {Application} from "express";
import {Config} from "./model/config";
import {Datasource} from "./persistance/datasource";
import {AccountService} from "./service/account-service";
import {DisciplineService} from "./service/discipline-service";
import {PersonService} from "./service/person-service";
import {RegistrationService} from "./service/registration-service";
import {AuthService} from "./service/auth-service";

export function init(config: Config, app: Application, datasource: Datasource): Application {
    const accountDao = datasource.createAccountDao();

    const authService: AuthService = new AuthService(config.secret, accountDao);
    const accountService: AccountService = new AccountService(accountDao);
    const disciplineService: DisciplineService = new DisciplineService(datasource.createDisciplineDao());
    const personService: PersonService = new PersonService(datasource.createPersonDao());
    const registrationService: RegistrationService = new RegistrationService(datasource.createRegistrationDao());

    // extract loggedIn user from auth token
    app.use(async (req, res, next) => {
        const auth = req.header('Authorization');
        if (auth && auth.startsWith('Bearer ')) {
            try {
                res.locals.account = await authService.verify(auth.substring(7));
            } catch (e) {
                console.warn(e)
            }
        }
        next();
    });

    app.use('/api/v1/auth', initAuth(config, express.Router(), accountService, authService));
    app.use('/api/v1/accounts', initAccount(config, express.Router(), accountService));
    app.use('/api/v1/disciplines', initDiscipline(config, express.Router(), disciplineService));
    app.use('/api/v1/persons', initPerson(config, express.Router(), personService));
    app.use('/api/v1/registrations', initRegistration(config, express.Router(), registrationService));

    return app
}
