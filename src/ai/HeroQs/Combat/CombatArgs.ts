
import { ISkill, SkillName } from "GameDefinitions/ISkill";
import { RepeatingActionArgs } from "../Actions/RepeatingActionArgs";

export class CombatArgs extends RepeatingActionArgs {
    constructor(skill: SkillName, cooldown: number) {
        super();

        this.DelayInMS = 250;

        this.Skill = { "name": skill, "cooldown": cooldown };

        // const json: ISkill = show_json("G.skills" + skill);

        /*if (json !== undefined) {
            this.Skill.name = json.
        }*/
    }

    public CombatEnabled: boolean = false;
    public Skill: ISkill;
}
