import { D, DebugLevel } from "../Base/Debug";

import { HP_SMALL, MP_SMALL } from "GameDefinitions/IItem";
import { ActionQueue } from "../Actions/ActionQueue";
import { RepeatingAction } from "../Actions/RepeatingAction";
import { UsePotionsAction } from "../Actions/UsePotionsAction";
import { Movement } from "../Base/Movement";
import { ITargetArgs, Target } from "../Base/Target";
import { Combat } from "../Base/Combat";

import { CombatStack } from "../Actions/CombatStack";

import { ShopAction } from "../Actions/ShopAction";

import G_skills from "../../../GameDefinitions/G/skills.json";

// import { CodeCostMeter } from "../../gui/CodeCostMeter";
import { RestockItem } from "../Actions/RestockItem";

export class HeroClass {
    constructor() {
        this.MovementTactics = new Movement();
        this.Queue = new ActionQueue();

        const targets: ITargetArgs = {};
        targets.MonsterFilter = [];
        targets.MonsterParams = { "min_xp": 100, "min_att": 60, "max_att": 200, };
        this.Targeting = new Target(targets);

        this.CombatTactics = new CombatStack(this.Targeting, this.MovementTactics);

        const autoattack = new Combat("attack");
        this.CombatTactics.Load([autoattack]);

        this.ShoppingSetup();
        this.KeymapSetup();
        this.DebugSetup();

        this.Queue.push(new UsePotionsAction());
        this.Queue.push(new RepeatingAction(loot));
        this.Queue.push(this.CombatTactics);
        //this.Queue.push(this.MovementTactics);
        this.Queue.push(this.Shopping);

        this.Queue.Start();
    }

    public CombatTactics: CombatStack;
    public MovementTactics: Movement;
    public Queue: ActionQueue;
    public Shopping!: ShopAction;
    public Targeting: Target;

    public ShoppingSetup() {
        const HP = new RestockItem(HP_SMALL, 15, 400, "potions");
        const MP = new RestockItem(MP_SMALL, 15, 400, "potions");

        this.Shopping = new ShopAction( { "Restock": [HP, MP] });
    }

    public DebugSetup() {
        D.Level = DebugLevel.Critical;
        D.Enabled = true;
        D.DrawingEnabled = true;
        D.CodeCost = false;
    }

    public KeymapSetup() {
        set_skillbar(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]);
        map_key("1", "use_hp");
        map_key("2", "use_mp");
        unmap_key("3");
        unmap_key("4");
        unmap_key("5");
        unmap_key("6");
        unmap_key("7");
        map_key("8", "stop");
        map_key("9", "snippet", "parent.stop_runner();");
        map_key("0", "snippet", 'load_code("' + character.ctype + '")');
    }
}
