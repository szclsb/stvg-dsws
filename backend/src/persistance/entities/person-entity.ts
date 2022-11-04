import {Sex} from "../../model/sex";

export interface PersonEntity {
    id?: number;
    accountId?: number;
    firstName: string;
    lastName: string;
    sex: Sex;
    yearOfBirth: number;
}
