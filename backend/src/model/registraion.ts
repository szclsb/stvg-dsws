import {Category, Discipline} from "./discipline";
import {ObjectID} from "bson";

export class Registration {
    discipline: ObjectID | Discipline;
    category: ObjectID | Category;
    member: string | string[];
}

export function mapper(body: any): Registration {
    return {
        discipline: body.discipline,
        category: body.category,
        member: body.member,
    }
}
