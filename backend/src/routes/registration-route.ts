import {Config} from "../model/config";
import  {Router} from "express";
import {
    getLoggedIn, createResponse, readResponse, updateResponse
} from "../utils/route-utils";
import {mapper} from "../model/registraion";
import {RegistrationService} from "../service/registration-service";

export function init(config: Config, router: Router, service: RegistrationService): Router {
    router.post("/", (req, res) => {
        const loggedIn = getLoggedIn(res);
        const body = mapper(req.body);
        createResponse(service.create(loggedIn, body), 'api/v1/registrations', req, res);
    });
    router.get("/", (req, res) => {
        // todo query param for account id;
        const loggedIn = getLoggedIn(res);
        readResponse(service.findAll(), req, res);
    });
    router.get("/:id", (req, res) => {
        const loggedIn = getLoggedIn(res);
        const id = req.params.id as string;
        readResponse(service.findById(id), req, res);
    });
    router.put("/:id", (req, res) => {
        const loggedIn = getLoggedIn(res);
        const id = req.params.id as string;
        const body = mapper(req.body);
        updateResponse(service.findAndUpdate(id, body), req, res);
    });
    router.delete("/:id", (req, res) => {
        const loggedIn = getLoggedIn(res);
        const id = req.params.id as string;
        updateResponse(service.findAndDelete(id), req, res);
    });

    // TODO check category
    // insertGuardedRoute<Registration>(router, em, mapper, 'api/v1/person',
    //     (reg, insertedId) => `created registration ${reg.discipline}/${reg.category} ${reg.member} with id ${insertedId}`);
    // router.get("/", (req, res) => {
    //     const filter: Selector = {}
    //     const accountId = req.query.aid as (string | undefined);
    //     if (accountId) {
    //         filter.account = new ObjectID(accountId);
    //     }
    //     const disciplineId = req.query.did as (string | undefined);
    //     if (disciplineId) {
    //         filter.account = new ObjectID(disciplineId);
    //     }
    //     const categoryId = req.query.cid as (string | undefined);
    //     if (categoryId) {
    //         filter.account = new ObjectID(categoryId);
    //     }
    //     em.findMany(filter).then((entities) => {
    //         res.status(200).json(entities).send();
    //     }).catch((err) => {
    //         console.warn(err);
    //         res.status(500).send();
    //     });
    // });
    // readRoute<Registration>(router, em);
    //
    // // TODO check category
    // updateGuardedRoute<Registration>(router, [ADMIN], em, mapper,
    //     (id, old, altered) => `updated registration with id ${id}`);
    // deleteGuardedRoute<Registration>(router, [ADMIN], em,
    //     (id) => `deleted registration with id ${id}`);

    console.debug(`initialized route registration`);
    return router;
}
