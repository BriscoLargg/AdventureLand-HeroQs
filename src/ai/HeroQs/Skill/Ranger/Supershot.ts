import { ISkill, SkillName } from "../../../../GameDefinitions/ISkill";

export class Supershot implements ISkill {
    public name: SkillName = SkillName.supershot;
    public cooldown: number = 30000;
}
