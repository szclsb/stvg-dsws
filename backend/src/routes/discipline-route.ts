import {Config} from "../model/config";
import {Router} from "express";
import {Discipline, mapper} from "../model/discipline";
import {requireRoles, deleteRoute, insertRoute, readAllRoute, readRoute, updateRoute} from "../utils/route-utils";
import {ADMIN} from "../roles";
import {EntityManager} from "../persistance/entity-manager";
import {ObjectID} from "bson";

export function init(config: Config, router: Router, em: EntityManager<Discipline, ObjectID>): Router {
    router.use(requireRoles([ADMIN]));
    insertRoute<Discipline>(router, em, mapper, 'api/v1/discipline',
        (discipline, insertedId) => `created discipline ${discipline.name} with id ${insertedId}`);
    readAllRoute<Discipline>(router, em);
    readRoute<Discipline>(router, em);
    updateRoute<Discipline>(router, em, mapper,
        (id, discipline) => `updated discipline with id ${id}`);
    deleteRoute(router, em, (id) => `deleted discipline with id ${id}`);
    console.debug(`initialized route discipline`);
    return router;
}

