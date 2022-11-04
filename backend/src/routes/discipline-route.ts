import {Config} from "../model/config";
import {Router} from "express";
import {Discipline, mapper} from "../model/discipline";
import {
    buildCallbackDelete, buildCallbackInsert, buildCallbackRead, buildCallbackReadAll, buildCallbackUpdate,
    buildPrepareNothing, buildPrepareReqBody, buildPrepareEntityWithBody, buildPrepareReqPathId,
    buildRequireNothing, buildRequireRole,
    deleteRoute, insertRoute, readAllRoute, readRoute, updateRoute,
} from "../utils/route-utils";
import {ADMIN} from "../roles";
import {DisciplineDao} from "../persistance/dao/discipline-dao";

export function init(config: Config, router: Router, dao: DisciplineDao): Router {
    insertRoute<Discipline, Discipline>(router,
        buildPrepareReqBody(mapper),
        buildRequireRole([ADMIN]),
        buildCallbackInsert<Discipline>(dao, 'api/v1/discipline',
            (discipline, insertedId) => `created discipline ${discipline.name} with id ${insertedId}`));
    readAllRoute<Discipline, void>(router,
        buildPrepareNothing(),
        buildRequireNothing(),
        buildCallbackReadAll(dao));
    readRoute<Discipline, string>(router,
        buildPrepareReqPathId(),
        buildRequireNothing(),
        buildCallbackRead(dao));
    updateRoute<Discipline, [string, Discipline, Discipline]>(router,
        buildPrepareEntityWithBody(mapper, dao),
        buildRequireRole([ADMIN]),
        buildCallbackUpdate(dao,
            (id, _old, _new) => `updated discipline with id ${id}`));
    deleteRoute<Discipline, string>(router,
        buildPrepareReqPathId(),
        buildRequireRole([ADMIN]),
        buildCallbackDelete(dao, (id) => `deleted discipline with id ${id}`));
    console.debug(`initialized route discipline`);
    return router;
}

