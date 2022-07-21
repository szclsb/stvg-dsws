import {Router} from "express";
import {ObjectID} from "bson";
import {Db} from "mongodb";
import {Config} from "../model/config";
import {Account} from "../model/account";

const collectionName = "accounts"

export function init(config: Config, router: Router, db: Db): Router {
    router.get("/self", (req, res) => {
        const account: Account & {_id: ObjectID} = res.locals.account;
        if (account) {
            res.status(200).json(account);
        }
        else {
            res.status(401).send();
        }
    });
    router.get("/:id", (req, res) => {
        const id = req.params.id as string;
        db.collection(collectionName).findOne({_id: new ObjectID(id)},
            {projection: {password: 0}}, (err, data) => {
            if (!err) {
                res.json(data).send()
            } else {
                console.warn(err);
                res.status(500).send();
            }
        });
    });
    router.get("/", (req, res) => {
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
    console.debug(`initialized route account`);
    return router;
}
