import {Router} from "express";
import {Config} from "../model/config";
import {
    readResponse,
} from "../utils/route-utils";
import {AccountService} from "../service/account-service";

export function init(config: Config, router: Router, service: AccountService): Router {
    router.get("/", (req, res) => {
        readResponse(service.findAll(), req, res);
    });
    router.get("/:id", (req, res) => {
        const id = req.params.id as string;
        readResponse(service.findById(id), req, res);
    });
    console.debug(`initialized route account`);
    return router;
}
