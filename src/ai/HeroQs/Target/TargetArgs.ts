import { IEntity } from "GameDefinitions/IEntity";
import { RepeatingActionArgs } from "../Actions/RepeatingActionArgs";
import { BaseArgs } from "../Base/Args";
import { Vector } from "../Base/Vector";

export class TargetArgs extends BaseArgs {
    public CombatTarget?: IEntity | undefined;
    public CombatTargetVector?: Vector;
    public MonsterFilter?: string[];
    public MonsterParams?: any;
    public PotentialTargets?: IEntity[];
}
