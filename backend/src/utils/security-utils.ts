import {Account} from "../model/account";
import {WithID} from "../model/models";
import {HttpError} from "../http-error";


export function checkLoggedIn(account?: WithID<Account>): any {
    if (!account) {
        throw new HttpError(HttpError.UNAUTHENTICATED, "Nicht eingeloggd")
    }
}
