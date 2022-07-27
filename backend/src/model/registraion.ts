import {Category, Discipline} from "./discipline";
import {Account} from "./account";


export class Registration {
    account: string | Account;
    discipline: string | Discipline;
    category: string | Category;
    member: string | string[];
}
