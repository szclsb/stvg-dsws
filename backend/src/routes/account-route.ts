import {Router} from "express";
import {ObjectID} from "bson";
import {Config} from "../model/config";
import {requireRoles, requireRolesOrId} from "../utils/route-utils";
import {ADMIN} from "../roles";
import {EntityManager} from "../persistance/entity-manager";
import {Account} from "../model/account";

export function init(config: Config, router: Router, em: EntityManager<Account, ObjectID>): Router {
    router.get("/:id", requireRolesOrId([ADMIN], (req) => Promise.resolve(req.params.id as string)), (req, res) => {
        const id = req.params.id as string;
        em.findOne({_id: new ObjectID(id)}, {password: 0}).then((entity) => {
            res.json(entity).status(200).send();
        }).catch((err) => {
            console.warn(err);
            res.status(500).send();
        });
    });
    router.get("/", requireRoles([ADMIN]), (req, res) => {
        em.findMany(undefined, {password: 0}).then((entity) => {
            res.json(entity).status(200).send();
        }).catch((err) => {
            console.warn(err);
            res.status(500).send();
        });
    });
    console.debug(`initialized route account`);
    return router;
}
