import {Config} from "../model/config";
import  {Router} from "express";
import {
    requireLoggedIn,
    insertGuardedRoute,
    deleteGuardedRoute,
    updateGuardedRoute,
    readRoute
} from "../utils/route-utils";
import {Registration, mapper} from "../model/registraion";
import {ObjectID} from "bson";
import {EntityManager, Selector} from "../persistance/entity-manager";
import {WithAccount} from "../model/account";
import {ADMIN} from "../roles";

export function init(config: Config, router: Router, em: EntityManager<WithAccount<Registration>, ObjectID>): Router {
    router.use(requireLoggedIn());

    // TODO check category
    insertGuardedRoute<Registration>(router, em, mapper, 'api/v1/person',
        (reg, insertedId) => `created registration ${reg.discipline}/${reg.category} ${reg.member} with id ${insertedId}`);
    router.get("/", (req, res) => {
        const filter: Selector = {}
        const accountId = req.query.aid as (string | undefined);
        if (accountId) {
            filter.account = new ObjectID(accountId);
        }
        const disciplineId = req.query.did as (string | undefined);
        if (disciplineId) {
            filter.account = new ObjectID(disciplineId);
        }
        const categoryId = req.query.cid as (string | undefined);
        if (categoryId) {
            filter.account = new ObjectID(categoryId);
        }
        em.findMany(filter).then((entities) => {
            res.status(200).json(entities).send();
        }).catch((err) => {
            console.warn(err);
            res.status(500).send();
        });
    });
    readRoute<Registration>(router, em);

    // TODO check category
    updateGuardedRoute<Registration>(router, [ADMIN], em, mapper,
        (id, old, altered) => `updated registration with id ${id}`);
    deleteGuardedRoute<Registration>(router, [ADMIN], em,
        (id) => `deleted registration with id ${id}`);

    console.debug(`initialized route registration`);
    return router;
}
