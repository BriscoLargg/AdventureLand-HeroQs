import { ISkill } from "GameDefinitions/ISkill";
import { IEntity } from "../../../GameDefinitions/IEntity";
import { RepeatingActionArgs } from "../Actions/RepeatingActionArgs";

export class CombatActionArgs extends RepeatingActionArgs {
    public CombatMode: boolean = true;
    public CombatTarget?: IEntity | undefined;
    public MonsterFilter?: string[];
    public MonsterParams?: any;
    public PotentialTargets?: IEntity[];
    public SearchAndDestroy: boolean = false;
    public Skill?: ISkill;
}
