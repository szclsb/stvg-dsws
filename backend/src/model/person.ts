import {Sex} from "./sex";
import {Account} from "./account";

export interface Person {
    account: string | Account;
    firstName: string;
    lastName: string;
    sex: Sex;
    yearOfBirth: number;
}
