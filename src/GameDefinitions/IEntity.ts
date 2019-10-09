import { IBuff } from "./IBuff";

export interface IEntity {
    name?: string;
    id?: string;
    real_x?: number;
    real_y?: number;
    going_x?: number;
    going_y?: number;
    hp: number;
    max_hp: number;
    mp: number;
    max_mp: number;
    attack: number;
    target: string;
    xp: number;
    type: string;
    mtype?: string;
    transform?: any;
    dead: boolean;
    npc?: boolean;
    // Buffs are 's' ???? -_-
    s?: { [T in keyof string]: IBuff };
    targeting_party?: boolean;
  }
