import { D } from "../Base/Debug";

import { RepeatingAction } from "./RepeatingAction";
import { RepeatingActionArgs } from "./RepeatingActionArgs";

import { SkillName } from "GameDefinitions/ISkill";

export class UsePotionsAction extends RepeatingAction {
    constructor(args: RepeatingActionArgs) {
        super(args, 200);
        this.Args = args;
        this.Action = this.UseHPOrMP;
    }

    public Args: RepeatingActionArgs;
    public LastPotion: Date = new Date();
    public Name: string = "UsePotions";
    public MissingHP: number = character.max_hp - character.hp;
    public MissingMP: number = character.max_mp - character.mp;
    public RemainingPercentMP: number = character.mp / character.max_mp;
    public RemainingPercentHP: number = character.hp / character.max_hp;

    public UpdateStats() {
        this.MissingHP = character.max_hp - character.hp;
        this.MissingMP = character.max_mp - character.mp;
        this.RemainingPercentMP = character.mp / character.max_mp;
        this.RemainingPercentHP = character.hp / character.max_hp;
        D.DebugVerbose("MissingHP: " + this.MissingHP + "  MissingMP: " + this.MissingMP);
    }

    public UseHPOrMP() {
        let used = false;
        if ( new Date() < parent.next_skill.use_hp) { return; }
        this.UpdateStats();

        D.DebugInfo("Remaining HP%: " + this.RemainingPercentHP +
                    "Remaining MP%: " + this.RemainingPercentMP);

        if (this.RemainingPercentHP < 0.2) {
            use(SkillName.use_hp);
            used = true;
        } else if (this.RemainingPercentMP < 0.3) {
            use(SkillName.use_mp);
            used = true;
        } else if (this.MissingHP > 200 ) {
            use(SkillName.use_hp);
            used = true;
        } else if(this.MissingMP > 300) {
            use(SkillName.use_mp);
            used = true;
        }
        // else if(character.hp<character.max_hp) use('use_hp'),used=true;
        // else if(character.mp<character.max_mp) use('use_mp'),used=true;

        if (used) {
            D.DebugInfo("Last Potion used at " + this.LastPotion);
            this.LastPotion = new Date();
        }
    }
}
