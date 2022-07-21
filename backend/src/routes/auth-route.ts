import {Router} from "express";
import {Db} from "mongodb";
import {ObjectID} from "bson";
import {Config} from "../model/config";
import {Account} from "../model/account";
import {hashPassword, signJwt, verifyPassword} from "../utils/auth-utils";

const collectionName = "accounts"

export function init(config: Config, router: Router, db: Db): Router {
    router.post("/register", (req, res) => {
        const registration = req.body as Account & {password: string}
        hashPassword(registration.password).then(hash => {
            const account: Account & {_id?: ObjectID, password: string, emailVerified: boolean} = {
                username: registration.username,
                password: hash,
                email: registration.email,
                address: registration.address,
                emailVerified: false,
            }
            db.collection(collectionName).insertOne(account, (err, data) => {
                if (!err) {
                    console.log(`registered account ${account.username} with id ${account._id}`);
                    res.setHeader('Location', `api/v1/account/${account._id}`).status(201).send()
                } else {
                    console.warn(err);
                    res.status(500).send();
                }
            });
        });
    });

    router.post("/login", (req, res) => {
        const cred = req.body as {
            username: string
            password: string
        }
        db.collection(collectionName).findOne({username: cred.username}, (err, data) => {
            if (!err) {
                verifyPassword(cred.password, data.password).then(result => {
                    if (result) {
                        signJwt({
                            _id: data._id,
                            username: data.username,
                            email: data.email,
                            address: data.address,
                            emailVerified: data.emailVerified,
                        }, config.secret)
                            .then(token => res.status(200).send(token))
                            .catch(error => {
                                console.error(error);
                                res.status(500).send();
                            })
                    } else {
                        res.status(400).send();
                    }
                })
            } else {
                console.warn(err);
                res.status(400).send();
            }
        });
    });
    console.debug(`initialized route auth`);
    return router;
}
