import { IItem } from "./game";
import { IEntity } from "./IEntity";

export interface ICharacter extends IEntity {
  party?: string;
  name: string;
  range: number;
  items: IItem[];
  ctype: string;
  rip: boolean;
  gold: number;
  xp: number;
  max_xp: number;
  moving: boolean;
  cc: number;
}
