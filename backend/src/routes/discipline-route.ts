import {Config} from "../model/config";
import {Router} from "express";
import {mapper} from "../model/discipline";
import {
    createResponse, readResponse, updateResponse,
} from "../utils/route-utils";
import {DisciplineService} from "../service/discipline-service";

export function init(config: Config, router: Router, service: DisciplineService): Router {
    router.post("/", (req, res) => {
        const body = mapper(req.body);
        createResponse(service.create(body), 'api/v1/disciplines', req, res);
    });
    router.get("/", (req, res) => {
        readResponse(service.findAll(), req, res);
    });
    router.get("/:id", (req, res) => {
        const id = req.params.id as string;
        readResponse(service.findById(id), req, res);
    });
    // router.put("/:id", (req, res) => {
    //     const id = parseInt(req.params.id as string, 10);
    //     const body = mapper(req.body);
    //     updateResponse(service.update(id, body), req, res);
    // });
    router.delete("/:id", (req, res) => {
        const id = req.params.id as string;
        updateResponse(service.delete(id), req, res);
    });

    // insertRoute<Discipline, Discipline>(router,
    //     buildPrepareReqBody(mapper),
    //     buildRequireRole([ADMIN]),
    //     buildCallbackInsert<Discipline>(dao, ,
    //         (discipline, insertedId) => `created discipline ${discipline.name} with id ${insertedId}`));
    // readAllRoute<Discipline, void>(router,
    //     buildPrepareNothing(),
    //     buildRequireNothing(),
    //     buildCallbackReadAll(dao));
    // readRoute<Discipline, string>(router,
    //     buildPrepareReqPathId(),
    //     buildRequireNothing(),
    //     buildCallbackRead(dao));
    // updateRoute<Discipline, [string, Discipline, Discipline]>(router,
    //     buildPrepareEntityWithBody(mapper, dao),
    //     buildRequireRole([ADMIN]),
    //     buildCallbackUpdate(dao,
    //         (id, _old, _new) => `updated discipline with id ${id}`));
    // deleteRoute<Discipline, string>(router,
    //     buildPrepareReqPathId(),
    //     buildRequireRole([ADMIN]),
    //     buildCallbackDelete(dao, (id) => `deleted discipline with id ${id}`));
    console.debug(`initialized route discipline`);
    return router;
}

