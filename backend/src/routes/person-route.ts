import {Config} from "../model/config";
import {Router} from "express";
import {
    requireLoggedIn,
    insertAccountRelatedRoute,
    readAccountRelatedRoute,
    requireRoleOrId,
    readAllAccountRelatedRoute,
    insertRoute,
    buildPrepareReqBody,
    buildRequireLoggedIn,
    buildCallbackInsert,
    buildCallbackInsertWithAccount,
    readAllRoute,
    buildPrepareNothing,
    buildRequireRoleOrId,
    buildCallbackReadAll,
    buildCallbackReadManyByAccount,
    readRoute,
    buildPrepareReqPathId, updateRoute, buildPrepareEntityWithBody, buildPrepareEntity
} from "../utils/route-utils";
import {Person, mapper} from "../model/person";
import {ADMIN} from "../roles";
import {PersonDao} from "../persistance/dao/person-dao";

export function init(config: Config, router: Router, dao: PersonDao): Router {
    insertRoute<Person>(router,
        buildPrepareReqBody(mapper),
        buildRequireLoggedIn(),
        buildCallbackInsertWithAccount(dao, 'api/v1/person',
            (person, insertedId) => `created person ${person.firstName} ${person.lastName} with id ${insertedId}`)
    );
    readAllRoute<void>(router,
        buildPrepareNothing(),
        buildRequireLoggedIn(),
        buildCallbackReadManyByAccount(dao)
    );
    readRoute<>(router,
        buildPrepareEntity(dao),
        buildRequireRoleOrId([ADMIN], (person) => ),
        buildCallbackReadManyByAccount(dao)
    );
    updateRoute<[string, Person, Person]>(router,
        buildPrepareEntityWithBody(mapper, dao),
        buildRequireRoleOrId([ADMIN], )
        );

    console.debug(`initialized route person`);
    return router;
}
