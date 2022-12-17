import {Request, Response, Router} from "express";
import {Account} from "../model/account";
import {Dao, ReadDao} from "../persistance/dao/dao";
import {HttpError} from "../http-error";
import {WithID} from "../model/models";

// export type BodyMapper<T> = (body: any) => T;
// export type PrepareRequest<F> = (req: Request) => Promise<F>;
// export type AuthorizeAccount<F> = (account?: WithID<Account>, f?: F) => Promise<'Unauthenticated' | 'Unauthorized' | 'Authorized'>;
// export type AuthorizedCallback<F> = (res: Response, f: F, account?: WithID<Account>) => any;
// export type InsertSuccess<T> = (entity: T, id: string) => string;
// export type UpdateSuccess<T> = (id: string, old: T, altered: T) => string;
// export type DeleteSuccess = (id: string) => string;

export function readResponse<T>(promise: Promise<T>, req: Request, res: Response): any {
    promise.then(x => {
        res.status(200).json(x).send();
    }).catch(errorCallback(res));
}

export function createResponse(promise: Promise<string>, baseUrl: string, req: Request, res: Response): any {
    promise.then(insertedId => {
        res.setHeader('Location', `${baseUrl}/${insertedId}`).status(201).send();
    }).catch(errorCallback(res));
}

export function updateResponse(promise: Promise<void>, req: Request, res: Response): any {
    promise.then(() => {
        res.status(204).send();
    }).catch(errorCallback(res));
}

function errorCallback(res: Response): (error?: any) => any {
    return error => {
        console.warn(error);
        if (error instanceof HttpError) {
            res.status(error.code).json({
                message: error.message
            }).send();
        } else {
            res.status(500).json({
                message: 'internal server error'
            }).send();
        }
    }
}

export function getLoggedIn(res: Response): WithID<Account> | undefined {
    return res.locals.account;
}


// export function buildRequireNothing(): AuthorizeAccount<any> {
//     return _ => new Promise<any>((resolve, reject) => {
//         resolve(null);
//     });
// }
//
// export function buildRequireLoggedIn(): AuthorizeAccount<any> {
//     return (account, _) => new Promise<any>((resolve, reject) => {
//         resolve(!account ? "Unauthenticated" : null)
//     });
// }
//
// export function buildRequireRole(roles: string[]): AuthorizeAccount<any> {
//     return (account, _) => new Promise<any>((resolve, reject) => {
//         resolve(!account ? "Unauthenticated" : roles.some(role => account.roles.includes(role)) ? null : "Unauthorized")
//     });
// }
//
// export function buildRequireRoleOrId<F>(roles: string[], idExtr: (f: F) => Promise<string>): AuthorizeAccount<F> {
//     return async (account, f) => {
//         const id = await idExtr(f);
//         return !account ? "Unauthenticated" : account.id === id || roles.some(role => account.roles.includes(role)) ? "Authorized" : "Unauthorized";
//     }
// }
//
//
//
// export function accessFilter<F>(req: Request, res: Response, prepareRequest: PrepareRequest<F>, authorize: AuthorizeAccount<F>, onAuthorized: AuthorizedCallback<F>): any {
//     const loggedIn: WithID<Account> | undefined = res.locals.account;
//     prepareRequest(req).then(f => {
//         authorize(loggedIn, f).then(result => {
//             switch (result) {
//                 case "Unauthenticated":
//                     res.status(401).send();
//                     break;
//                 case "Unauthorized":
//                     res.status(403).send();
//                     break;
//                 case "Authorized":
//                     onAuthorized(res, f, loggedIn);
//                     break;
//             }
//         });
//     });
//
// }
//
// export function insertRoute<F>(router: Router, prepareRequest: PrepareRequest<F>, authorize: AuthorizeAccount<F>, authCallback: AuthorizedCallback<F>): any {
//     router.post("/", (req, res) => {
//         accessFilter(req, res, prepareRequest , authorize, authCallback);
//     });
// }
//
// export function readAllRoute<F>(router: Router, prepareRequest: PrepareRequest<F>, authorize: AuthorizeAccount<F>, authCallback: AuthorizedCallback<F>): any {
//     router.get("/", (req, res) => {
//         accessFilter(req, res, prepareRequest, authorize, authCallback);
//     });
// }
//
// export function readRoute<F>(router: Router, prepareRequest: PrepareRequest<F>, authorize: AuthorizeAccount<F>, authCallback: AuthorizedCallback<F>): any {
//     router.get("/:id", (req, res) => {
//         accessFilter(req, res, prepareRequest, authorize, authCallback);
//     });
// }
//
// export function updateRoute<F>(router: Router, prepareRequest: PrepareRequest<F>, authorize: AuthorizeAccount<F>, authCallback: AuthorizedCallback<F>): any {
//     router.put("/:id", (req, res) => {
//         accessFilter(req, res, prepareRequest, authorize, authCallback)
//     });
// }
//
// export function deleteRoute<F>(router: Router, prepareRequest: PrepareRequest<F> | undefined, authorize: AuthorizeAccount<F>, authCallback: AuthorizedCallback<F>): any {
//     router.delete("/:id", (req, res) => {
//         accessFilter(req, res, prepareRequest, authorize, authCallback);
//     });
// }
//
// export function buildPrepareNothing(): (req: Request) => Promise<void> {
//     return (req) => Promise.resolve();
// }
//
// export function buildPrepareReqPathId(): (req: Request) => Promise<string> {
//     return (req) => Promise.resolve(req.params.id);
// }
//
// export function buildPrepareReqBody<T>(mapper: BodyMapper<T>): (req: Request) => Promise<T> {
//     return (req) => Promise.resolve(mapper(req.body));
// }
//
// export function buildPrepareEntity<T>(dao: Dao<T>): (req: Request) => Promise<WithID<T>> {
//     return async (req) => {
//         const id = req.params.id as string;
//         return await dao.find(id);
//     }
// }
//
// export function buildPrepareEntityWithBody<T>(mapper: BodyMapper<T>, dao: ReadDao<T>): (req: Request) => Promise<[WithID<T>, T]> {
//     return async (req) => {
//         const id = req.params.id as string;
//         const body = mapper(req.body);
//         const entity = await dao.find(id);
//         return [entity, body];
//     }
// }
//
// export function buildCallbackInsert<T>(dao: Dao<T>, baseUrl: string, successMessage: InsertSuccess<T>): AuthorizedCallback<T> {
//     return (res, body, _) => {
//         dao.insert(body).then((insertedId) => {
//             console.log(successMessage(body, insertedId));
//             res.setHeader('Location', `${baseUrl}/${insertedId}`).status(201).send();
//         }).catch((err) => {
//             console.warn(err);
//             res.status(500).send();
//         });
//     }
// }
//
// export function buildCallbackInsertWithAccount<T>(dao: Dao<T>, baseUrl: string, successMessage: InsertSuccess<T>): AuthorizedCallback<T> {
//     return (res, body, account) => {
//         dao.insert(body, account.id).then((insertedId) => {
//             console.log(successMessage(body, insertedId));
//             res.setHeader('Location', `${baseUrl}/${insertedId}`).status(201).send();
//         }).catch((err) => {
//             console.warn(err);
//             res.status(500).send();
//         });
//     }
// }
//
// export function buildCallbackRead<T>(dao: ReadDao<T>): AuthorizedCallback<string> {
//     return (res,  id, _) => {
//         dao.find(id).then((entity) => {
//             res.status(200).json(entity).send();
//         }).catch((err) => {
//             console.warn(err);
//             res.status(500).send();
//         });
//     }
// }
//
// export function buildCallbackReadLoaded<T>(): AuthorizedCallback<T> {
//     return (res, entity, _) => {
//         res.status(200).json(entity).send();
//     }
// }
//
// export function buildCallbackReadAll<T>(dao: ReadDao<T>): AuthorizedCallback<void> {
//     return (res, _id, _acc) => {
//         dao.findAll().then((entity) => {
//             res.status(200).json(entity).send();
//         }).catch((err) => {
//             console.warn(err);
//             res.status(500).send();
//         });
//     }
// }
//
// export function buildCallbackReadManyByAccount<T>(dao: ReadDao<T>): AuthorizedCallback<void> {
//     return (res, _id, account) => {
//         dao.findAll(account?.id).then((entity) => {
//             res.status(200).json(entity).send();
//         }).catch((err) => {
//             console.warn(err);
//             res.status(500).send();
//         });
//     }
// }
//
// export function buildCallbackUpdate<T>(dao: Dao<T>, successMessage: UpdateSuccess<T>): AuthorizedCallback<[string, T, T]> {
//     return (res, [eid, body, entity], _) => {
//         dao.update(eid, entity).then(() => {
//             console.log(successMessage(eid, entity, body));
//             res.status(204).send();
//         }).catch((err) => {
//             console.warn(err);
//             res.status(500).send();
//         });
//     }
// }
//
// export function buildCallbackDelete<T>(dao: Dao<T>, successMessage: DeleteSuccess): AuthorizedCallback<string> {
//     return (res, eid, _) => {
//         dao.delete(eid).then(() => {
//             console.log(successMessage(eid));
//             res.status(204).send();
//         }).catch((err) => {
//             console.warn(err);
//             res.status(500).send();
//         });
//     }
// }
