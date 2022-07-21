import {Config} from "../model/config";
import {Router} from "express";
import {Db} from "mongodb";
import {Discipline, mapper} from "../model/discipline";
import {deleteRoute, insertRoute, readAllRoute, readRoute, updateRoute} from "../utils/route-utils";

const collectionName = "disciplines";

export function init(config: Config, router: Router, db: Db): Router {
    insertRoute<Discipline>(router, db.collection(collectionName), mapper, 'api/v1/discipline',
        (discipline) => `created discipline ${discipline.name} with id ${discipline._id}`);
    readAllRoute<Discipline>(router, db.collection(collectionName));
    readRoute<Discipline>(router, db.collection(collectionName));
    updateRoute<Discipline>(router, db.collection(collectionName), mapper,
        (id, discipline) => `updated discipline with id ${id}`);
    deleteRoute(router, db.collection(collectionName), (id) => `deleted discipline with id ${id}`);
    console.debug(`initialized route discipline`);
    return router;
}

