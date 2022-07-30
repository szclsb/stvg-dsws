import {Config} from "../model/config";
import {Router} from "express";
import {
    requireLoggedIn,
    insertGuardedRoute,
    deleteGuardedRoute,
    updateGuardedRoute,
    readRoute
} from "../utils/route-utils";
import {Person, mapper} from "../model/person";
import {ObjectID} from "bson";
import {EntityManager, Selector} from "../persistance/entity-manager";
import {WithAccount} from "../model/account";
import {ADMIN} from "../roles";

export function init(config: Config, router: Router, em: EntityManager<WithAccount<Person>, ObjectID>): Router {
    router.use(requireLoggedIn());

    insertGuardedRoute<Person>(router, em, mapper, 'api/v1/person',
        (person, insertedId) => `created person ${person.firstName} ${person.lastName} with id ${insertedId}`);
    router.get("/", (req, res) => {
        const filter: Selector = {};
        const accountId = req.query.aid as (string | undefined);
        if (accountId) {
            filter.account = new ObjectID(accountId)
        }
        em.findMany(filter).then((entities) => {
            res.status(200).json(entities).send();
        }).catch((err) => {
            console.warn(err);
            res.status(500).send();
        });
    });
    readRoute<Person>(router, em);
    updateGuardedRoute<Person>(router, [ADMIN], em, mapper,
        (id, old, altered) => `updated person with id ${id}`);
    deleteGuardedRoute<Person>(router, [ADMIN], em,
        (id) => `deleted person with id ${id}`);

    console.debug(`initialized route person`);
    return router;
}
