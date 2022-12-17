import {Sex} from "../../model/sex";
import {Entity} from "./entity";


export interface DisciplineEntity extends Entity {
    name: string;
    minMembers: number;
    maxMembers: number;
    categories: CategoryEntity[];
}

export interface CategoryEntity extends Entity {
    name: string;
    distance: number;
    sex: Sex
    minAge: number;
    maxAge: number;
}
