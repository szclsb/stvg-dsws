import {Sex} from "./sex";

export interface Person {
    firstName: string;
    lastName: string;
    sex: Sex;
    yearOfBirth: number;
}

export function mapper(body: any): Person {
    return {
        firstName: body.firstName,
        lastName: body.lastName,
        sex: body.sex,
        yearOfBirth: body.yearOfBirth
    }
}
