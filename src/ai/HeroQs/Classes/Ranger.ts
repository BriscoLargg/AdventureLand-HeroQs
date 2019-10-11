import { D } from "../Base/Debug";

import { SkillName } from "GameDefinitions/ISkill";
import { Combat } from "../Combat/Combat";
import { CombatArgs } from "../Combat/CombatArgs";
import { HeroClass } from "./HeroClass";

class Ranger extends HeroClass {
    constructor() {
        super();

        const supershot = new Combat(new CombatArgs(SkillName.supershot, 30000));
        const huntersmark = new Combat(new CombatArgs(SkillName.huntersmark, 10000));

        this.CombatTactics.push(supershot);
        this.CombatTactics.push(huntersmark);

        // D.CodeCost = true;

        this.Targeting.Args.MonsterFilter.push("rat");
    }
}

export const RangerClass = new Ranger();
