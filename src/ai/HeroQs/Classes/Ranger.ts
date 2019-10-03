import { IItem } from "GameDefinitions/game";

import { ActionArgs } from "../Actions/ActionArgs";
import { ActionQueue } from "../Actions/ActionQueue";
import { RepeatingAction } from "../Actions/RepeatingAction";
import { RepeatingActionArgs } from "../Actions/RepeatingActionArgs";
import { UsePotionsAction } from "../Actions/UsePotionsAction";
import { D, DebugLevel } from "../Base/Debug";
import { CombatAction } from "../Combat/CombatAction";
import { CombatActionArgs } from "../Combat/CombatActionArgs";
import { CombatStack } from "../Combat/CombatStack";
import { RestockItem } from "../Shop/RestockItem";
import { ShopAction } from "../Shop/ShopAction";
import { ShopActionArgs } from "../Shop/ShopActionArgs";
import { HuntersMark } from "../Skill/Ranger/HuntersMark";
import { Supershot } from "../Skill/Ranger/Supershot";

import { CodeCostMeter } from "gui/CodeCostMeter";
import { Action } from "../Actions/Action";

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

D.Level = DebugLevel.Error;
D.Enabled = true;
D.DrawingEnabled = true;

new CodeCostMeter().init_ccmeter();

const combatArgs: CombatActionArgs = new CombatActionArgs();
combatArgs.CombatMode = true;
combatArgs.MonsterFilter = ["tortoise"]; // ["bee", "goo"];
combatArgs.MonsterParams = { "min_xp": 100, "min_att": 60, "max_att": 200, };
combatArgs.SearchAndDestroy = true;

let shotArgs = new CombatActionArgs();
shotArgs = { ...combatArgs };
shotArgs.Skill = new Supershot();
const supershot = new CombatAction(shotArgs);

let markArgs = new CombatActionArgs();
markArgs = { ... combatArgs };
markArgs.Skill = new HuntersMark();
const huntersmark = new CombatAction(markArgs);

const combatStack = new CombatStack(new ActionArgs());
combatStack.push(new CombatAction(combatArgs));
combatStack.push(supershot);
combatStack.push(huntersmark);

const HP = new RestockItem(HP_SMALL, 50, 1200, "potions");
const MP = new RestockItem(MP_SMALL, 50, 1200, "potions");
const shopArgs: ShopActionArgs = new ShopActionArgs();
shopArgs.Restock = [HP, MP];
shopArgs.DelayInMS = 30000;

// console.log(args);
const Q = new ActionQueue(new ActionArgs());

Q.push(new UsePotionsAction(new RepeatingActionArgs()));
Q.push(new RepeatingAction(new RepeatingActionArgs(), loot));
Q.push(combatStack);
Q.push(new ShopAction(shopArgs));
/*
Q.Push(new RepeatingAction(new RepeatingActionArgs(), () => {
     console.log("I'm a lumberjaaack and I'm okay...") }, 60000));
*/
Q.Start();
