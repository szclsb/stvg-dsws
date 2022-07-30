import {RequestHandler, Response, Router} from "express";
import {ObjectID} from "bson";
import {Account, WithAccount} from "../model/account";
import {ADMIN} from "../roles";
import {EntityManager, EntityMapper, Selector, WithID} from "../persistance/entity-manager";

export type InsertSuccess<T> = (entity: T, id: string) => string;
export type UpdateSuccess<T> = (id: string, old: T, altered: T) => string;
export type DeleteSuccess = (id: string) => string;

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
        const account = res.locals.account as WithID<Account, ObjectID>;
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
    const account = res.locals.account as WithID<Account, ObjectID>;
    if (!account) {
        res.status(401).send();
    } else if ((account.roles !== undefined && roles.some(role => account.roles.includes(role))) || (allowedId !== undefined && allowedId === account._id)) {
        callback();
    } else {
        res.status(403).send();
    }
}

export function insertRoute<T>(router: Router, em: EntityManager<T, ObjectID>, map: EntityMapper<T>, baseUrl: string, successMessage: InsertSuccess<T>): any {
    router.post("/", (req, res) => {
        const entity = map(req.body) as WithID<T, ObjectID>;
        em.insertOne(entity).then((insertedId) => {
            console.log(successMessage(entity, insertedId.toHexString()));
            res.setHeader('Location', `${baseUrl}/${insertedId}`).status(201).send();
        }).catch((err) => {
            console.warn(err);
            res.status(500).send();
        });
    });
}

export function readAllRoute<T, R = T>(router: Router, em: EntityManager<T, ObjectID>, filter?: Selector, projection?: Selector): any {
    router.get("/", (req, res) => {
        em.findMany<R>(filter, projection).then((entities) => {
            res.status(200).json(entities).send();
        }).catch((err) => {
            console.warn(err);
            res.status(500).send();
        });
    });
}

export function readRoute<T, R = T>(router: Router, em: EntityManager<T, ObjectID>, projection?: Selector): any {
    router.get("/:id", (req, res) => {
        const id = req.params.id as string;
        em.findOne<R>({_id: new ObjectID(id)}, projection).then((entity) => {
            res.status(200).json(entity).send();
        }).catch((err) => {
            console.warn(err);
            res.status(500).send();
        });
    });
}

export function updateRoute<T>(router: Router, em: EntityManager<T, ObjectID>, map: EntityMapper<T>, successMessage: UpdateSuccess<T>): any {
    router.put("/:id", (req, res) => {
        const id = req.params.id as string;
        const entity = map(req.body)
        const entityCopy = Object.assign({}, entity);
        em.updateOne({_id: new ObjectID(id)}, entity).then(() => {
            console.log(successMessage(id, entityCopy, entity));
            res.status(204).send();
        }).catch((err) => {
            console.warn(err);
            res.status(500).send();
        });
    });
}

export function deleteRoute<T>(router: Router, em: EntityManager<T, ObjectID>, successMessage: DeleteSuccess): any {
    router.delete("/:id", (req, res) => {
        const id = req.params.id as string;
        em.deleteOne({_id: new ObjectID(id)}).then(() => {
            console.log(successMessage(id));
            res.status(204).send();
        }).catch((err) => {
            console.warn(err);
            res.status(500).send();
        });
    });
}

export function insertGuardedRoute<T>(router: Router, em: EntityManager<WithAccount<T>, ObjectID>, entityMapper: EntityMapper<T>, baseUrl: string, successMessage: InsertSuccess<T>) {
    router.post("/", (req, res) => {
        const account = res.locals.account as WithID<T, ObjectID>;
        const entity: WithAccount<T> = Object.assign({
            account: account._id
        }, entityMapper(req.body));
        em.insertOne(entity).then((insertedId) => {
            console.log(successMessage(entity, insertedId.toHexString()));
            res.setHeader('Location', `${baseUrl}/${insertedId}`).status(201).send();
        }).catch((err) => {
            console.warn(err);
            res.status(500).send();
        });
    });
}

export function updateGuardedRoute<T>(router: Router, roles: string[], em: EntityManager<WithAccount<T>, ObjectID>, entityMapper: EntityMapper<T>, successMessage: UpdateSuccess<T>) {
    router.put("/:id", (req, res) => {
        const account = res.locals.account as WithID<Account, ObjectID>;
        const id = req.params.id as string;
        const filter = {_id: new ObjectID(id)};
        const newEntity: T = entityMapper(req.body);
        em.findOne(filter).then((oldEntity) => {
            guardRoles(res, roles, oldEntity.account as ObjectID, () => {
                em.updateOne(filter, Object.assign({
                    account: account._id
                }, newEntity)).then(() => {
                    console.log(successMessage(id, oldEntity, newEntity));
                    res.status(204).send();
                }).catch((err) => {
                    console.warn(err);
                    res.status(500).send(err);
                });
            });
        }).catch((err) => {
            console.warn(err);
            res.status(500).send(err);
        });
    });
}

export function deleteGuardedRoute<T>(router: Router, roles: string[], em: EntityManager<WithAccount<T>, ObjectID>, successMessage: DeleteSuccess) {
    router.put("/:id", (req, res) => {
        const id = req.params.id as string;
        const filter = {_id: new ObjectID(id)};
        em.findOne(filter).then((oldEntity) => {
            guardRoles(res, [ADMIN], oldEntity.account as ObjectID, () => {
                em.deleteOne(filter).then(() => {
                    console.log(successMessage(id));
                    res.status(204).send();
                }).catch((err) => {
                    console.warn(err);
                    res.status(500).send(err);
                });
            });
        }).catch((err) => {
            console.warn(err);
            res.status(500).send(err);
        });
    });
}
