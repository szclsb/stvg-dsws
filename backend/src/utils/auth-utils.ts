import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken'
import {JwtPayload} from "jsonwebtoken";
import {Account} from "../model/account";
import {AccountEntity} from "../persistance/entities/account-entity";
import {WithID} from "../model/models";

const radix = 16;
const saltRounds = 12;
const algorithm = 'HS256';
const issuer = 'stvgebenstorf.ch';

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, passwordHash?: string): Promise<boolean> {
    return !!passwordHash && await bcrypt.compare(password, passwordHash);
}

export async function signJwt(entity: AccountEntity, secret: string): Promise<string> {
    return new Promise((resolve, reject) => {
        jwt.sign({
            username: entity.username,
            email: entity.email,
            roles: entity.roles
        }, secret, {
            algorithm,
            subject: entity.id,
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

export async function verifyJwt(token: string, secret: string): Promise<WithID<Account>> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, {
            algorithms: [algorithm],
            issuer
        }, (err, decoded: JwtPayload) => {
            if (!err) {
                resolve({
                    id: decoded.sub,
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
