import {Router} from "express";
import {ObjectID} from "bson";
import {Config} from "../model/config";
import {Account} from "../model/account";
import {hashPassword, signJwt, verifyPassword} from "../utils/auth-utils";
import {EntityManager} from "../persistance/entity-manager";

type InternalAccount = Account & {password: string, emailVerified: boolean};

export function init(config: Config, router: Router, em: EntityManager<Account, ObjectID>): Router {
    router.post("/register", (req, res) => {
        const registration = req.body as Account & {password: string}
        hashPassword(registration.password).then(hash => {
            const account: InternalAccount = {
                username: registration.username,
                password: hash,
                email: registration.email,
                address: registration.address,
                emailVerified: false,
            }
            em.insertOne(account).then((insertedId) => {
                console.log(`registered account ${account.username} with id ${insertedId.toHexString()}`);
                res.setHeader('Location', `api/v1/account/${insertedId.toHexString()}`).status(201).send();
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
        em.findOne<InternalAccount>({username: cred.username}).then((entity) =>  {
            verifyPassword(cred.password, entity.password).then(result => {
                if (result) {
                    signJwt({
                        _id: entity._id,
                        username: entity.username,
                        email: entity.email,
                        address: entity.address,
                        emailVerified: entity.emailVerified,
                        roles: entity.roles
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
