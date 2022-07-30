import {EntityManager} from "./entity-manager";
import {Config} from "../model/config";

export interface Datasource<ID> {
    connect(config: Config): Promise<any>;
    close(): Promise<any>;
    createEntityManager<T>(name: string): EntityManager<T, ID>;
}
