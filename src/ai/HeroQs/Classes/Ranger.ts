import { D, DebugLevel } from "../Base/Debug";

import { Combat } from "../Base/Combat";
import { HeroClass } from "./HeroClass";

import G_skills from "../../../GameDefinitions/G/skills.json";

class Ranger extends HeroClass {
    constructor() {
        super();

        D.CodeCost = false;
        D.Level = DebugLevel.Error;

        const supershot = new Combat("huntersmark");
        const huntersmark = new Combat("supershot");

        this.CombatTactics.push(supershot);
        this.CombatTactics.push(huntersmark);

        //this.Targeting.Args.MonsterFilter.push("mrgreen");
        this.Targeting.MonsterFilter.push("croc");
        //this.Targeting.Args.MonsterFilter.push("scorpion");
    }
}

export const RangerClass = new Ranger();
