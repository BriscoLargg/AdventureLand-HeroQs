import { D } from "../Base/Debug";

import { HeroClass } from "./HeroClass";

class Mage extends HeroClass {
    constructor() {
        super();

        D.CodeCost = false;
        // this.Targeting.MonsterFilter.push("mrpumpkin");
        // this.Targeting.MonsterFilter.push("mrgreen");
    }
}

export const MageClass = new Mage();
