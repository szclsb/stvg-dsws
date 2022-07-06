import {Router} from "express";
import {ObjectID} from "bson";
import {Db} from "mongodb";
import {Config} from "../model/config";

const collectionName = "accounts"

export function init(config: Config, router: Router, db: Db): Router {
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

    return router;
}
