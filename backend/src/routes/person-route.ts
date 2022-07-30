import {Config} from "../model/config";
import {Router} from "express";
import {Db, Document, WithId as WithObjectId} from "mongodb";
import {
    DbMapper, requireLoggedIn,
    insertGuardedRoute,
    deleteGuardedRoute,
    updateGuardedRoute,
    readRoute,
    readCallback
} from "../utils/route-utils";
import {Person, mapper} from "../model/person";
import {ObjectID} from "bson";

const collectionName = "persons";

const dbMapper: DbMapper<Person> = (doc?: WithObjectId<Document>) => {
    return {
        _id: doc._id,
        account: doc.account,
        firstName: doc.firstName,
        lastName: doc.lastName,
        sex: doc.sex,
        yearOfBirth: doc.yearOfBirth,
    }
}

export function init(config: Config, router: Router, db: Db): Router {
    router.use(requireLoggedIn());

    insertGuardedRoute<Person>(router, db.collection(collectionName), mapper, 'api/v1/person',
        (person) => `created person ${person.firstName} ${person.lastName} with id ${person._id}`);
    router.get("/", (req, res) => {
        const pipeline: Document[] = [];
        const accountId = req.query.aid as (string | undefined);
        if (accountId) {
            pipeline.push({$filter: {account: new ObjectID(accountId)}});
        }
        db.collection(collectionName).aggregate(pipeline).toArray(readCallback(res));
    });
    readRoute<Person>(router, db.collection(collectionName));
    updateGuardedRoute<Person>(router, db.collection(collectionName), mapper, dbMapper,
        (id, old, altered) => `updated person with id ${id}`);
    deleteGuardedRoute<Person>(router, db.collection(collectionName), dbMapper,
        (id) => `deleted person with id ${id}`);

    console.debug(`initialized route person`);
    return router;
}
