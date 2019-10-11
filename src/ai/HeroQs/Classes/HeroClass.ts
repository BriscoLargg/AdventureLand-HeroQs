import { D, DebugLevel } from "../Base/Debug";

import { HP_SMALL, MP_SMALL } from "GameDefinitions/IItem";
import { SkillName } from "GameDefinitions/ISkill";
import { ActionQueue } from "../Actions/ActionQueue";
import { RepeatingAction } from "../Actions/RepeatingAction";
import { RepeatingActionArgs } from "../Actions/RepeatingActionArgs";
import { UsePotionsAction } from "../Actions/UsePotionsAction";
import { Movement } from "../Base/Movement";
import { Combat } from "../Combat/Combat";
import { CombatArgs } from "../Combat/CombatArgs";
import { CombatStack } from "../Combat/CombatStack";
import { CombatStackArgs } from "../Combat/CombatStackArgs";
import { RestockItem } from "../Shop/RestockItem";
import { ShopAction } from "../Shop/ShopAction";
import { ShopActionArgs } from "../Shop/ShopActionArgs";
import { Target } from "../Target/Target";
import { TargetArgs } from "../Target/TargetArgs";

import { CodeCostMeter } from "GUI/CodeCostMeter";

export class HeroClass {
    constructor() {
        this.MovementTactics = new Movement();
        this.Queue = new ActionQueue(new RepeatingActionArgs());

        const targets: TargetArgs = new TargetArgs();
        targets.MonsterFilter = [];
        targets.MonsterParams = { "min_xp": 100, "min_att": 60, "max_att": 200, };
        this.Targeting = new Target(targets);

        const combatArgs = new CombatStackArgs(this.Targeting, this.MovementTactics);
        this.CombatTactics = new CombatStack(combatArgs);

        const autoattack = new Combat(new CombatArgs(SkillName.attack, 250));
        this.CombatTactics.Load([autoattack]);

        this.ShoppingSetup();
        this.KeymapSetup();
        this.DebugSetup();

        this.Queue.push(new UsePotionsAction(new RepeatingActionArgs()));
        this.Queue.push(new RepeatingAction(new RepeatingActionArgs(), loot));
        this.Queue.push(this.CombatTactics);
        this.Queue.push(this.MovementTactics);
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
        const shopArgs: ShopActionArgs = new ShopActionArgs();
        shopArgs.Restock = [HP, MP];
        shopArgs.DelayInMS = 30000;
        this.Shopping = new ShopAction(shopArgs);
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
