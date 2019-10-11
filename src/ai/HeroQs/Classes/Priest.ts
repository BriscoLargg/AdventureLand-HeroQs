import { SkillName } from "GameDefinitions/ISkill";
import { Combat } from "../Combat/Combat";
import { CombatArgs } from "../Combat/CombatArgs";
import { HeroClass } from "./HeroClass";

class Priest extends HeroClass {
    constructor() {
        super();

        this.Targeting.Args.MonsterFilter.push("armadillo");
    }
}

export const PriestClass = new Priest();
