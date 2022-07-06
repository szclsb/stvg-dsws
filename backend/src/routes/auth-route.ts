import {Router} from "express";
import {Account} from "../model/account";
import {Db} from "mongodb";
import {ObjectID} from "bson";
import {hashPassword} from "../auth-utils";

const collectionName = "accounts"

export function init(router: Router, db: Db): Router {
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

    // router.post("/login", (req, res) => {
    //     const cred = req.body as {
    //         username: string
    //         password: string
    //     }
    // });

    return router;
}
