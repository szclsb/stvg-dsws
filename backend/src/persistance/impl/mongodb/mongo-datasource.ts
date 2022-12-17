import {Datasource} from "../../datasource";
import {Config} from "../../../model/config";
import {Db, MongoClient} from "mongodb";
import {MongoAccountDao} from "./dao/mongo-account-dao";
import {DisciplineDao} from "../../dao/discipline-dao";
import {PersonDao} from "../../dao/person-dao";
import {RegistrationDao} from "../../dao/registration-dao";
import {MongoDisciplineDaoDao} from "./dao/mongo-discipline-dao";
import {MongoPersonDao} from "./dao/mongo-person-dao";
import {MongoRegistrationDao} from "./dao/mongo-registration-dao";

export class MongoDatasource implements Datasource {

    private client?: MongoClient;
    private dbName?: string;

    async connect(config: Config): Promise<any> {
        this.client = await MongoClient.connect(`mongodb+srv://${config.dbUser}:${config.dbPassword}@${config.dbConnection}`);
        this.dbName = config.dbName;
    }

    async close(): Promise<any> {
        await this.client.close();
    }

    createAccountDao(): MongoAccountDao {
        return new MongoAccountDao(this.client.db(this.dbName));
    }

    createDisciplineDao(): DisciplineDao {
        return new MongoDisciplineDaoDao(this.client.db(this.dbName));
    }

    createPersonDao(): PersonDao {
        return new MongoPersonDao(this.client.db(this.dbName));
    }

    createRegistrationDao(): RegistrationDao {
        return new MongoRegistrationDao(this.client.db(this.dbName));
    }


}
