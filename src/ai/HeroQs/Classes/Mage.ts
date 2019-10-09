import { ActionArgs } from "../Actions/ActionArgs";
import { ActionQueue } from "../Actions/ActionQueue";
import { RepeatingAction } from "../Actions/RepeatingAction";
import { RepeatingActionArgs } from "../Actions/RepeatingActionArgs";
import { UsePotionsAction } from "../Actions/UsePotionsAction";
import { D, DebugLevel } from "../Base/Debug";

import { CombatStack } from "../Combat/CombatStack";
import { CombatStackArgs } from "../Combat/CombatStackArgs";
import { RestockItem } from "../Shop/RestockItem";
import { ShopAction } from "../Shop/ShopAction";
import { ShopActionArgs } from "../Shop/ShopActionArgs";

import { CodeCostMeter } from "GUI/CodeCostMeter";
import { Target } from "../Target/Target";

import { IItem } from "GameDefinitions/IItem";
import { SkillName } from "GameDefinitions/ISkill";
import { Combat } from "../Combat/Combat";
import { CombatArgs } from "../Combat/CombatArgs";
import { TargetArgs } from "../Target/TargetArgs";

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
game_log("To reload your code, first press 9 to stop the current AI, and then press 0 to reload the code.");

const HP_SMALL: IItem = {"name": "hpot0"};
const MP_SMALL: IItem = {"name": "mpot0"};

D.Level = DebugLevel.Information;
D.Enabled = true;
D.DrawingEnabled = true;
D.CodeCost = false;

new CodeCostMeter().init_ccmeter();

const targetArgs: TargetArgs = new TargetArgs();

targetArgs.MonsterFilter = ["snake"]; // ["bee", "goo"];
targetArgs.MonsterParams = { "min_xp": 100, "min_att": 60, "max_att": 200, };
const target = new Target(targetArgs);

const supershot = new Combat(new CombatArgs(SkillName.supershot, 30000));
const huntersmark = new Combat(new CombatArgs(SkillName.huntersmark, 10000));
const autoattack = new Combat(new CombatArgs(SkillName.attack, 250));

const combatArgs = new CombatStackArgs(target);
const combatStack: CombatStack = new CombatStack(combatArgs);
combatStack.Load([autoattack]);

const HP = new RestockItem(HP_SMALL, 15, 400, "potions");
const MP = new RestockItem(MP_SMALL, 50, 600, "potions");
const shopArgs: ShopActionArgs = new ShopActionArgs();
shopArgs.Restock = [HP, MP];
shopArgs.DelayInMS = 30000;

// console.log(args);
const Q = new ActionQueue(new RepeatingActionArgs());

Q.push(new UsePotionsAction(new RepeatingActionArgs()));
Q.push(new RepeatingAction(new RepeatingActionArgs(), loot));
Q.push(combatStack);
// Q.push(target);
Q.push(new ShopAction(shopArgs));
/*
Q.Push(new RepeatingAction(new RepeatingActionArgs(), () => {
     console.log("I'm a lumberjaaack and I'm okay...") }, 60000));
*/
Q.Start();
