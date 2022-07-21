import {Sex} from "./sex";

export interface Discipline {
    name: string;
    minMembers: number;
    maxMembers: number;
    categories: Category[];
}

export interface Category {
    name: string;
    distance: number;
    sex: Sex
    minAge: number;
    maxAge: number;
}

export function mapper(body: any): Discipline {
    return {
        name: body.name,
        categories: body.categories?.map(catMapper),
        minMembers: body.minMembers,
        maxMembers: body.maxMembers,
    }
}

export function catMapper(body: any): Category {
    return {
        name: body.name,
        distance: body.distance,
        sex: body.sex,
        minAge: body.minAge,
        maxAge: body.maxAge,
    }
}
