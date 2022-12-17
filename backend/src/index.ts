import express from "express";

import * as bodyParser from "body-parser";
import * as json from '../dsws-config.json';
import {init as initRoutes} from "./routes";
import {loadConfig} from "./utils/config-utils";
import {MongoDatasource} from "./persistance/impl/mongodb/mongo-datasource";
import {Datasource} from "./persistance/datasource";
import {ObjectID} from "bson";

const app = express();
const config = loadConfig(json);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE');
    next();
});

const datasource: Datasource = new MongoDatasource();
datasource.connect(config).then(() => {
    console.log(`connected to database`);
    const server = initRoutes(config, app, datasource).listen(config.port, () => {
        console.log( `server started at http://localhost:${ config.port }` );
    });
    process.on('exit', () => {
        console.log(`terminating`)
        server.close(() => {
            console.log(`server closed`)
        });
        datasource.close().then(() => {
            console.log(`db connection closed`)
        });
    });
});


