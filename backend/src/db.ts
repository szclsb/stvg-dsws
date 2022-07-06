import {Db, MongoClient} from 'mongodb'
import {Config} from "./model/config";

export async function init(config: Config): Promise<Db> {
    return await MongoClient.connect(`mongodb+srv://${config.dbUser}:${config.dbPassword}@${config.dbConnection}`)
        .then(client => client.db(config.dbName));
}
