import express from "express";

import * as bodyParser from "body-parser";
import * as json from '../dsws-config.json';
import {init as initDb} from "./db";
import {init as initRoutes} from "./routes";
import {loadConfig} from "./utils/config-utils";

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

initDb(config).then(db => {
    initRoutes(config, app, db).listen(config.port, () => {
        console.log( `server started at http://localhost:${ config.port }` );
    } );
})


