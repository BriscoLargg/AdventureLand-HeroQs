import { ActionQueue } from "./HeroLoops/ActionQueue";
import { DebugLevel, D } from "./HeroLoops/Base/Debug";
import { CombatActionArgs, CombatAction } from "./HeroLoops/Base/Actions/CombatAction";
import { RepeatingAction, RepeatingActionArgs } from "./HeroLoops/Base/Actions/RepeatingAction";
import { UsePotionsAction } from "./HeroLoops/Base/Actions/UsePotionsAction";

set_skillbar(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]);

map_key("1", "use_hp");
map_key("2", "use_mp");
unmap_key("3");
unmap_key("4");
unmap_key("5");
unmap_key("6");
unmap_key("7");
unmap_key("8");
map_key("9", "snippet", "parent.stop_runner();");
map_key("0", "snippet", 'load_code("' + character.ctype + '")');
game_log("To reload your code, first press 9 to stop the current AI, and then press 0 to reload the code.");

D.Level = DebugLevel.Information;
D.Enabled = true;

let args: CombatActionArgs = new CombatActionArgs();
args.CombatMode = true;
args.MonsterFilter = ["Goo"];
args.MonsterParams = { min_xp:100, min_att:60, max_att:200, }

//console.log(args);
let Q = new ActionQueue();

Q.Push(new UsePotionsAction(new RepeatingActionArgs()));
Q.Push(new RepeatingAction(new RepeatingActionArgs(), loot));
Q.Push(new CombatAction(args));

Q.Start();