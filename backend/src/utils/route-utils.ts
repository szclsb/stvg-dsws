import {RequestHandler, Response, Router} from "express";
import {ObjectID} from "bson";
import {WithId as WithObjectId, Collection, Document} from "mongodb";
import {EntityMapper, WithId} from "./main-utils";
import {Account, WithAccount} from "../model/account";
import {mapper, Person} from "../model/person";
import {ADMIN} from "../roles";

export type InsertSuccess<T> = (entity: WithId<T>) => string;
export type UpdateSuccess<T> = (id: string, old: T, altered: T) => string;
export type DeleteSuccess = (id: string) => string;
export type DbCallback = (res: any, err: any) => any;
export type DbMapper<T> = (doc?: WithObjectId<Document>) => WithId<WithAccount<T>>

export function requireLoggedIn(): RequestHandler {
    return (req, res, next) => {
        if (!res.locals.account) {
            res.status(401).send();
        } else {
            next();
        }
    }
}

export function requireRoles(roles: string[]): RequestHandler {
    return (req, res, next) => {
        const account = res.locals.account as WithId<Account>;
        if (!account) {
            res.status(401).send();
        } else if (account.roles !== undefined && roles.some(role => account.roles.includes(role))) {
            next();
        } else {
            res.status(403).send();
        }
    }
}

export function guardRoles(res: Response, roles: string[], allowedId: ObjectID | undefined, callback: () => any): any {
    const account = res.locals.account as WithId<Account>;
    if (!account) {
        res.status(401).send();
    } else if ((account.roles !== undefined && roles.some(role => account.roles.includes(role))) || (allowedId !== undefined && allowedId === account._id)) {
        callback();
    } else {
        res.status(403).send();
    }
}

export function insertRoute<T>(router: Router, collection: Collection, map: EntityMapper<T>, baseUrl: string, successMessage: InsertSuccess<T>): any {
    router.post("/", (req, res) => {
        const entity = map(req.body) as WithId<T>;
        collection.insertOne(entity, insertCallback(res, `${baseUrl}/${entity._id}`, successMessage(entity)));
    });
}

export function readAllRoute<T>(router: Router, collection: Collection): any {
    router.get("/", (req, res) => {
        collection.aggregate().toArray(readCallback(res));
    });
}

export function readRoute<T>(router: Router, collection: Collection): any {
    router.get("/:id", (req, res) => {
        const id = req.params.id as string;
        collection.findOne({_id: new ObjectID(id)}, readCallback(res));
    });
}

export function updateRoute<T>(router: Router, collection: Collection, map: EntityMapper<T>, successMessage: UpdateSuccess<T>): any {
    router.put("/:id", (req, res) => {
        const id = req.params.id as string;
        const entity = map(req.body)
        const entityCopy = Object.assign({}, entity);
        collection.updateOne({_id: new ObjectID(id)}, {$set: entity},
            alterCallback(res, successMessage(id, entityCopy, entity)));
    });
}

export function deleteRoute(router: Router, collection: Collection, successMessage: DeleteSuccess): any {
    router.delete("/:id", (req, res) => {
        const id = req.params.id as string;
        collection.deleteOne({_id: new ObjectID(id)},
            alterCallback(res, successMessage(id)));
    });
}

export function insertGuardedRoute<T>(router: Router, collection: Collection, entityMapper: EntityMapper<T>, baseUrl: string, successMessage: InsertSuccess<T>) {
    router.post("/", (req, res) => {
        const account = res.locals.account as WithId<Account>;
        const entity: WithId<WithAccount<T>> = Object.assign({
            account: account._id
        }, entityMapper(req.body));
        collection.insertOne(entity, insertCallback(res, `${baseUrl}/${entity._id}`, successMessage(entity)));
    });
}

export function updateGuardedRoute<T>(router: Router, collection: Collection, entityMapper: EntityMapper<T>, dbMapper: DbMapper<T>, successMessage: UpdateSuccess<T>) {
    router.put("/:id", (req, res) => {
        const id = req.params.id as string;
        const filter = {_id: new ObjectID(id)};
        const newEntity = entityMapper(req.body)
        collection.findOne(filter, (error, result) => {
            if (!error) {
                const oldEntity = dbMapper(result);
                guardRoles(res, [ADMIN], oldEntity.account as ObjectID, () => {
                    collection.updateOne(filter, {$set: newEntity}, alterCallback(res, successMessage(id, oldEntity, newEntity)));
                });
            } else {
                res.status(500).send(error);
            }
        });
    });
}

export function deleteGuardedRoute<T>(router: Router, collection: Collection, dbMapper: DbMapper<T>, successMessage: DeleteSuccess) {
    router.put("/:id", (req, res) => {
        const id = req.params.id as string;
        const filter = {_id: new ObjectID(id)};
        collection.findOne(filter, (error, result) => {
            if (!error) {
                const oldEntity = dbMapper(result);
                guardRoles(res, [ADMIN], oldEntity.account as ObjectID, () => {
                    collection.deleteOne(filter, alterCallback(res, successMessage(id)));
                });
            } else {
                res.status(500).send(error);
            }
        });
    });
}

export function insertCallback(res: Response, location: string, successMessage: string): DbCallback {
    return (err: any, data: any) => {
        if (!err) {
            console.log(successMessage);
            res.setHeader('Location', location).status(201).send();
        } else {
            console.warn(err);
            res.status(500).send();
        }
    }
}

export function readCallback(res: Response): DbCallback {
    return (err: any, data: any) => {
        if (!err) {
            res.status(200).json(data).send();
        } else {
            console.warn(err);
            res.status(500).send();
        }
    };
}

export function alterCallback(res: Response, successMessage: string): DbCallback {
    return (err: any, data: any) => {
        if (!err) {
            console.log(successMessage);
            res.status(204).send();
        } else {
            console.warn(err);
            res.status(500).send();
        }
    };
}
