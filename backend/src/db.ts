import {Db, MongoClient} from 'mongodb'
import {ConfigUtils} from "./config-utils";

export async function init(config: ConfigUtils): Promise<Db> {
    return await MongoClient.connect(`mongodb+srv://${config.dbUser}:${config.dbPassword}@${config.dbConnection}`)
        .then(client => client.db(config.dbName));
}
