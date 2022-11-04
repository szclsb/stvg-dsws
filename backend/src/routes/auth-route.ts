import {Router} from "express";
import {Config} from "../model/config";
import {Account} from "../account/model/account";
import {hashPassword, signJwt, verifyPassword} from "../utils/auth-utils";
import {AccountDao} from "../persistance/dao/account-dao";

export function init(config: Config, router: Router, dao: AccountDao): Router {
    router.post("/register", (req, res) => {
        const registration = req.body as Account & {password: string}
        hashPassword(registration.password).then(hash => {
            const account: Account = {
                username: registration.username,
                email: registration.email,
                address: registration.address
            }
            dao.register(account, hash).then((insertedId) => {
                console.log(`registered account ${account.username} with id ${insertedId}`);
                res.setHeader('Location', `api/v1/account/${insertedId}`).status(201).send();
            }).catch(err => {
                console.warn(err);
                res.status(500).send();
            });
        });
    });

    router.post("/login", (req, res) => {
        const cred = req.body as {
            username: string
            password: string
        }
        dao.findByUsername(cred.username).then(([account, phash]) => {
            verifyPassword(cred.password, phash).then(result => {
                if (result) {
                    signJwt({
                        id: account.id,
                        username: account.username,
                        email: account.email,
                        address: account.address,
                        roles: account.roles
                    }, config.secret)
                        .then(token => res.status(200).json({
                            access_token: token
                        }))
                        .catch(error => {
                            console.error(error);
                            res.status(500).send();
                        })
                } else {
                    res.status(400).send();
                }
            })
        }).catch((err) => {
            console.warn(err);
            res.status(400).send();
        });
    });
    console.debug(`initialized route auth`);
    return router;
}
