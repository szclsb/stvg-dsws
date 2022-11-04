import {WithID} from "../persistance/dao/dao";
import {Account} from "../model/account";
import {HttpError} from "../http-error";


export function checkLoggedIn(account?: WithID<Account>): any {
    if (!account) {
        throw new HttpError(HttpError.UNAUTHENTICATED, "Nicht eingeloggd")
    }
}
