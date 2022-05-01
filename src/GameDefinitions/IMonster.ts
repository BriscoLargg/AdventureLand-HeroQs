import { IEntity } from "./IEntity";

export interface IMonster extends IEntity {
    mtype: string;
    id: string;
    range: number;
    hp: number;
    max_hp: number;
  }
