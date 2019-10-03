import { IEntity } from "./IEntity";

export interface IMonster extends IEntity {
    mtype: string;
    id: string;
    range: number;
  }
