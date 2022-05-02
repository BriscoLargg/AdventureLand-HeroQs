import { SkillName } from "GameDefinitions/ISkill";

import { HeroClass } from "./HeroClass";

class Priest extends HeroClass {
    constructor() {
        super();

        // this.Targeting.MonsterFilter.push("armadillo");
    }
}

export const PriestClass = new Priest();
