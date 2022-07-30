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
import {Registration, mapper} from "../model/registraion";
import {ObjectID} from "bson";

const collectionName = "registrations";

const dbMapper: DbMapper<Registration> = (doc?: WithObjectId<Document>) => {
    return {
        _id: doc._id,
        account: doc.account,
        discipline: doc.discipline,
        category: doc.category,
        member: doc.member
    }
}

export function init(config: Config, router: Router, db: Db): Router {
    router.use(requireLoggedIn());

    // TODO check category
    insertGuardedRoute<Registration>(router, db.collection(collectionName), mapper, 'api/v1/person',
        (reg) => `created registration ${reg.discipline}/${reg.category} ${reg.member} with id ${reg._id}`);
    router.get("/", (req, res) => {
        const filter: Document = {}
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
        db.collection(collectionName).aggregate([{$filter: filter}]).toArray(readCallback(res));
    });
    readRoute<Registration>(router, db.collection(collectionName));

    // TODO check category
    updateGuardedRoute<Registration>(router, db.collection(collectionName), mapper, dbMapper,
        (id, old, altered) => `updated registration with id ${id}`);
    deleteGuardedRoute<Registration>(router, db.collection(collectionName), dbMapper,
        (id) => `deleted registration with id ${id}`);

    console.debug(`initialized route registration`);
    return router;
}
