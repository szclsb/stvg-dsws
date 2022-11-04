import {Sex} from "../../model/sex";


export interface DisciplineEntity {
    id?: number;
    name: string;
    minMembers: number;
    maxMembers: number;
    categories: CategoryEntity[];
}

export interface CategoryEntity {
    id?: number
    name: string;
    distance: number;
    sex: Sex
    minAge: number;
    maxAge: number;
}
