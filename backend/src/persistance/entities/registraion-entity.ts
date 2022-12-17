import {Entity} from "./entity";

export interface RegistrationEntity extends Entity{
    accountId?: string;
    disciplineId: string;
    categoryId: string;
    memberIds: string[];
}
