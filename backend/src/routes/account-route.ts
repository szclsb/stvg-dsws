import {Router} from "express";
import {Config} from "../model/config";
import {ADMIN} from "../roles";
import {AccountDao} from "../persistance/dao/account-dao";
import {
    buildPrepareNothing, buildPrepareReqPathId,
    buildRequireRole, buildRequireRoleOrId,
    readAllRoute, readRoute
} from "../utils/route-utils";

export function init(config: Config, router: Router, dao: AccountDao): Router {
    readAllRoute<void>(router,
        buildPrepareNothing(),
        buildRequireRole([ADMIN]),
        (res) => {
            dao.findAll().then((entities) => {
                res.status(200).json(entities.map(([account, _]) => account)).send();
            }).catch((err) => {
                console.warn(err);
                res.status(500).send();
            });
        }
    );
    readRoute<string>(router,
        buildPrepareReqPathId(),
        buildRequireRoleOrId([ADMIN], f => Promise.resolve(f)),
        (res, id) => {
            dao.find(id).then(([account, _]) => {
                res.status(200).json(account).send();
            }).catch((err) => {
                console.warn(err);
                res.status(500).send();
            });
        }
    )
    console.debug(`initialized route account`);
    return router;
}
