import {RequestHandler, Response, Router} from "express";
import {ObjectID} from "bson";
import {Collection} from "mongodb";
import {EntityMapper, WithId} from "./main-utils";
import {Account} from "../model/account";

export type InsertSuccess<T> = (entity: WithId<T>) => string;
export type UpdateSuccess<T> = (id: string, old: T, altered: T) => string;
export type DeleteSuccess = (id: string) => string;
export type DbCallback = (res: any, err: any) => any;

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

export function guardRoles(res: Response, roles: string[], allowedId: string | undefined, callback: () => any): any {
    const account = res.locals.account as WithId<Account>;
    if (!account) {
        res.status(401).send();
    } else if ((account.roles !== undefined && roles.some(role => account.roles.includes(role))) || (allowedId !== undefined && allowedId === account._id.toHexString())) {
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
