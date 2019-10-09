import { IItem, ItemName } from "GameDefinitions/IItem";
import { ISkill, SkillName } from "GameDefinitions/ISkill";
import { IEntity } from "./IEntity";
import { IMonster } from "./IMonster";


export interface IGameInfo {
    items: { [T in ItemName]: IItem };
    monsters: { [id: string]: IMonster };
    npcs: { [id: string]: IEntity };
    skills: { [T in SkillName]: ISkill };
    version: number;
}
