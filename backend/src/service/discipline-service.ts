import {DisciplineDao} from "../persistance/dao/discipline-dao";
import {Category, Discipline} from "../model/discipline";
import {WithID} from "../model/models";
import {CategoryEntity, DisciplineEntity} from "../persistance/entities/discipline-entity";
import {HttpError} from "../http-error";

function disciplineMapper(entity: DisciplineEntity): WithID<Discipline> {
    return {
        id: entity.id!,
        name: entity.name,
        minMembers: entity.minMembers,
        maxMembers: entity.maxMembers,
        categories: entity.categories.map(catEntity => categoryMapper(catEntity))
    }
}

function categoryMapper(entity: CategoryEntity): WithID<Category> {
    return {
        id: entity.id!,
        name: entity.name,
        distance: entity.distance,
        minAge: entity.minAge,
        maxAge: entity.maxAge,
        sex: entity.sex
    }
}

export class DisciplineService {
    private dao: DisciplineDao;

    constructor(dao: DisciplineDao) {
        this.dao = dao;
    }

    public async create(discipline: Discipline): Promise<number> {
        return await this.dao.insert(discipline);
    }

    public async findAll(): Promise<WithID<Discipline>[]> {
        const entities = await this.dao.findAll();
        return entities.map(entity => disciplineMapper(entity));
    }

    public async findById(id: number): Promise<WithID<Discipline>> {
        const entity = await this.dao.find(id);
        if (entity == null) {
            throw new HttpError(HttpError.NOT_FOUND ,`No discipline found with id ${id}`);
        }
        return disciplineMapper(entity);
    }

    public async findByName(name: string): Promise<WithID<Discipline>> {
        const entity = await this.dao.findByName(name);
        if (entity == null) {
            throw new HttpError(HttpError.NOT_FOUND ,`No discipline found with name ${name}`);
        }
        return disciplineMapper(entity);
    }

    // public async update(id: string, discipline: Discipline): Promise<any> {
    //     return;
    // }

    public async delete(id: number) {
        return await this.dao.delete(id);
    }
}
