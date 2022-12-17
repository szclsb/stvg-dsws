import {Config} from "../model/config";
import {Router} from "express";
import {
    getLoggedIn,
    createResponse,
    readResponse,
    updateResponse
} from "../utils/route-utils";
import {mapper} from "../model/person";
import {PersonService} from "../service/person-service";

export function init(config: Config, router: Router, service: PersonService): Router {
    router.post("/", (req, res) => {
        const loggedIn = getLoggedIn(res);
        const body = mapper(req.body);
        createResponse(service.create(loggedIn, body), 'api/v1/persons', req, res);
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

    // insertRoute<Person>(router,
    //     buildPrepareReqBody(mapper),
    //     buildRequireLoggedIn(),
    //     buildCallbackInsertWithAccount(dao, 'api/v1/person',
    //         (person, insertedId) => `created person ${person.firstName} ${person.lastName} with id ${insertedId}`)
    // );
    // readAllRoute<void>(router,
    //     buildPrepareNothing(),
    //     buildRequireLoggedIn(),
    //     buildCallbackReadManyByAccount(dao)
    // );
    // readRoute<>(router,
    //     buildPrepareEntity(dao),
    //     buildRequireRoleOrId([ADMIN], (person) => ),
    //     buildCallbackReadManyByAccount(dao)
    // );
    // updateRoute<[string, Person, Person]>(router,
    //     buildPrepareEntityWithBody(mapper, dao),
    //     buildRequireRoleOrId([ADMIN], )
    //     );

    console.debug(`initialized route person`);
    return router;
}
