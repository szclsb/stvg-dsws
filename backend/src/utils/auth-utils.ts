import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken'
import {Account} from "../model/account";
import e from "express";
import {ObjectID} from "bson";
import {JwtPayload} from "jsonwebtoken";
import {WithId} from "./main-utils";

const saltRounds = 12;
const algorithm = 'HS256';
const issuer = 'stvgebenstorf.ch';

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, passwordHash?: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
}

export async function signJwt(account: Account & {_id: ObjectID, emailVerified: boolean}, secret: string): Promise<string> {
    return new Promise((resolve, reject) => {
        jwt.sign({
            username: account.username,
            email: account.email,
            roles: account.roles
        }, secret, {
            algorithm,
            subject: account._id.toHexString(),
            expiresIn: '1h',
            issuer
        }, (err, token) => {
            if (!err) {
                resolve(token);
            } else {
                reject(err);
            }
        });
    });
}

export async function verifyJwt(token: string, secret: string): Promise<WithId<Account>> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, {
            algorithms: [algorithm],
            issuer
        }, (err, decoded: JwtPayload) => {
            if (!err) {
                resolve({
                    _id: new ObjectID(decoded.sub as string),
                    username: decoded.username,
                    email: decoded.email,
                    roles: decoded.roles
                });
            } else {
                reject(err);
            }
        });
    });
}
