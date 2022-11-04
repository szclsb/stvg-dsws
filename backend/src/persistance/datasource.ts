import {Config} from "../model/config";
import {AccountDao} from "./dao/account-dao";
import {DisciplineDao} from "./dao/discipline-dao";
import {PersonDao} from "./dao/person-dao";
import {RegistrationDao} from "./dao/registration-dao";

export interface Datasource {
    connect(config: Config): Promise<any>;
    close(): Promise<any>;

    createAccountDao(): AccountDao;
    createDisciplineDao(): DisciplineDao;
    createPersonDao(): PersonDao;
    createRegistrationDao(): RegistrationDao;
}
