import {Sex} from "../../model/sex";
import {Entity} from "./entity";

export interface PersonEntity extends Entity{
    accountId?: string;
    firstName: string;
    lastName: string;
    sex: Sex;
    yearOfBirth: number;
}
