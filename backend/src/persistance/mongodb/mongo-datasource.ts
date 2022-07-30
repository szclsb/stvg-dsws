import {Datasource} from "../datasource";
import {EntityManager} from "../entity-manager";
import {ObjectID} from "bson";
import {Config} from "../../model/config";
import {MongoClient} from "mongodb";
import {MongoEntityManager} from "./mongo-entity-manager";


export class MongoDatasource implements Datasource<ObjectID> {
    private client: MongoClient;
    private dbName: string;

    async connect(config: Config): Promise<any> {
        this.client = await MongoClient.connect(`mongodb+srv://${config.dbUser}:${config.dbPassword}@${config.dbConnection}`);
        this.dbName = config.dbName;
    }

    async close(): Promise<any> {
        await this.client.close();
    }

    createEntityManager<T>(name: string): EntityManager<T, ObjectID> {
        const collection = this.client.db(this.dbName).collection(name);
        return new MongoEntityManager<T>(collection);
    }
}
