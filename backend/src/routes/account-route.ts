import {Router} from "express";
import {ObjectID} from "bson";
import {Db} from "mongodb";
import {Config} from "../model/config";
import {guardRoles, requireLoggedIn} from "../utils/route-utils";
import {ADMIN} from "../roles";

const collectionName = "accounts"

export function init(config: Config, router: Router, db: Db): Router {
    router.use(requireLoggedIn());
    router.get("/:id", (req, res, next) => {
        const id = req.params.id as string;
        const oid = new ObjectID(id);
        guardRoles(res, [ADMIN], oid, () => {
            db.collection(collectionName).findOne({_id: oid}, {
                projection: {password: 0}
            }, (err, data) => {
                if (!err) {
                    res.json(data).send()
                } else {
                    console.warn(err);
                    res.status(500).send();
                }
            });
        });
    });
    router.get("/", (req, res) => {
        guardRoles(res, [ADMIN], undefined, () => {
            db.collection(collectionName).aggregate([
                {$project: {password: 0}}
            ]).toArray((err, data) => {
                if (!err) {
                    res.json(data).send()
                } else {
                    console.warn(err);
                    res.status(500).send();
                }
            });
        });
    });
    console.debug(`initialized route account`);
    return router;
}
