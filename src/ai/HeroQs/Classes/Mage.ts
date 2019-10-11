import { D } from "../Base/Debug";

import { SkillName } from "GameDefinitions/ISkill";
import { Combat } from "../Combat/Combat";
import { CombatArgs } from "../Combat/CombatArgs";
import { HeroClass } from "./HeroClass";

class Mage extends HeroClass {
    constructor() {
        super();

        this.Targeting.Args.MonsterFilter.push("osnake", "snake");
    }
}

export const MageClass = new Mage();
