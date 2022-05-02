import { ISkill, SkillName } from "../../../GameDefinitions/ISkill";

export class HuntersMark implements ISkill {
    public name: SkillName = SkillName.huntersmark;
    public cooldown: number = 10000;
}
