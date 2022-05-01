import { D, DebugLevel } from "../Base/Debug";

import { Combat } from "../Base/Combat";
import { HeroClass } from "./HeroClass";

import G_skills from "../../../GameDefinitions/G/skills.json";

class Ranger extends HeroClass {
    constructor() {
        super();

        const supershot = new Combat("huntersmark");
        const huntersmark = new Combat("supershot");

        this.CombatTactics.push(supershot);
        this.CombatTactics.push(huntersmark);

        //this.Targeting.Args.MonsterFilter.push("mrgreen");
        // this.Targeting.MonsterFilter.push("croc");
        // this.Targeting.MonsterFilter.push(".*");
        //this.Targeting.Args.MonsterFilter.push("scorpion");
    }
    
    public DebugSetup() {
            D.Level = DebugLevel.Verbose;
            D.Enabled = true;
            D.DrawingEnabled = true;
            D.CodeCost = true;
        }

}

export const RangerClass = new Ranger();
