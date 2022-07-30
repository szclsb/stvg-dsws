import {Router} from "express";
import {ObjectID} from "bson";
import {Config} from "../model/config";
import {guardRoles, requireLoggedIn} from "../utils/route-utils";
import {ADMIN} from "../roles";
import {EntityManager} from "../persistance/entity-manager";
import {Account} from "../model/account";

export function init(config: Config, router: Router, em: EntityManager<Account, ObjectID>): Router {
    router.use(requireLoggedIn());
    router.get("/:id", (req, res, next) => {
        const id = req.params.id as string;
        const oid = new ObjectID(id);
        guardRoles(res, [ADMIN], oid, () => {
            em.findOne({_id: oid}, {password: 0}).then((entity) => {
                res.json(entity).status(200).send();
            }).catch((err) => {
                console.warn(err);
                res.status(500).send();
            });
        });
    });
    router.get("/", (req, res) => {
        guardRoles(res, [ADMIN], undefined, () => {
            em.findMany(undefined, {password: 0}).then((entity) => {
                res.json(entity).status(200).send();
            }).catch((err) => {
                console.warn(err);
                res.status(500).send();
            });
        });
    });
    console.debug(`initialized route account`);
    return router;
}
