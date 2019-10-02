import { ActionQueue } from "../Base/ActionQueue";
import { DebugLevel, D } from "../Base/Debug";
import { CombatActionArgs, CombatAction } from "../Actions/CombatActions/CombatAction";
import { RepeatingAction, RepeatingActionArgs } from "../Actions/RepeatingAction";
import { UsePotionsAction } from "../Actions/UsePotionsAction";
import { CodeCostMeter } from "gui/CodeCostMeter";
import { ShopAction, ShopActionArgs, RestockItem } from "../Actions/ShopAction";
import { ItemInfo } from "definitions/game";
import { CombatStack } from "../Base/CombatStack";
import { Supershot, HuntersMark } from "../Skill/SkillInfo";

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


const HP_SMALL: ItemInfo = {name: 'hpot0'};
const MP_SMALL: ItemInfo = {name: 'mpot0'};

D.Level = DebugLevel.Error;
D.Enabled = true;
D.DrawingEnabled = true;

new CodeCostMeter().init_ccmeter();

let c_args: CombatActionArgs = new CombatActionArgs();
c_args.CombatMode = true;
c_args.MonsterFilter = ["armadillo"];//["bee", "goo"];
c_args.MonsterParams = { min_xp:100, min_att:60, max_att:200, }
c_args.SearchAndDestroy = true;

let shot_args = new CombatActionArgs();
shot_args = { ...c_args };
shot_args.Skill = new Supershot();
let supershot = new CombatAction(shot_args)

let mark_args = new CombatActionArgs();
mark_args = { ... c_args };
mark_args.Skill = new HuntersMark();
let huntersmark = new CombatAction(mark_args);

let combatStack = new CombatStack();
combatStack.push(new CombatAction(c_args));
combatStack.push(supershot);
combatStack.push(huntersmark);



let HP = new RestockItem(HP_SMALL, 50, 1200, "potions");
let MP = new RestockItem(MP_SMALL, 50, 1200, "potions");
let s_args: ShopActionArgs = new ShopActionArgs();
s_args.Restock = [HP, MP];
s_args.DelayInMS = 30000;

//console.log(args);
let Q = new ActionQueue();

Q.push(new UsePotionsAction(new RepeatingActionArgs()));
Q.push(new RepeatingAction(new RepeatingActionArgs(), loot));
Q.push(combatStack);
Q.push(new ShopAction(s_args));
//Q.Push(new RepeatingAction(new RepeatingActionArgs(), () => { console.log("I'm a lumberjaaack and I'm okay...") }, 60000));

Q.Start();