import { Entity, Monster } from "definitions/game";
import { CombatActionArgs } from "../Actions/CombatActions/CombatAction";
import { D } from "./Debug";

export function GetNearestTarget(args: CombatActionArgs) {
    if(args == undefined) return;
    if(args.CombatTarget && args.CombatTarget.dead) args.CombatTarget = undefined;

    MarkPotentialTargets(args);

    if(args.CombatTarget != undefined) return;
    set_message("Seeking target...");
    
    FilterPotentialTargetsForNearest(args);

    if(args.CombatTarget) change_target(args.CombatTarget);
    else
    {
        set_message("No eligible targets");
    }

    if(args.PotentialTargets && args.PotentialTargets.length > 0) {
        args.CombatTarget = args.PotentialTargets[0];
        D.DebugInfo("Target set: " + args.CombatTarget.name + " at distance " + distance(character, args.CombatTarget));
    }
}

export function MarkPotentialTargets(args: CombatActionArgs) {
    if(D.Drawing()){
        clear_drawings();

        if(args && args.PotentialTargets) {
            for(var monster of args.PotentialTargets) {
                if(monster.real_x && monster.real_y) draw_circle(monster.real_x, monster.real_y, character.range);
        }}
    }
}

export function IsTargetingFriendly(target: Entity) {
    return (IsTargetingParty(target) || IsTargetingMe(target));
}

export function IsTargetingParty(target: Entity) {
    return (parent.party_list.includes(target.target));
}

export function IsTargetingMe(target: Entity) {
    return (target.target == character.name);
}

export function IsTargetingNothing(target: Entity) {
    return (target.target == null);
}

//Default to true if no filter provided
export function FilterPotentialTargetsForNearest(args: CombatActionArgs) {

    let targets = InParentEntities((e: Monster) => (e.type == "monster"));

    if(targets) {
       targets = targets.filter((t) => {
            if(IsTargetingMe(t) || IsTargetingNothing(t) || IsTargetingParty(t)) {
                if(args.MonsterFilter == undefined || args.MonsterFilter.length == 0) return true;                
                for(var type of args.MonsterFilter) {
                    if(type == t.mtype) {
                        D.DebugInfo("Filtering " + t.mtype + " to " + type);
                        return true;
                    }
                }
            }
        });
    }

    args.PotentialTargets = targets;

    D.DebugInfo("Found " + targets.length + " eligible targets");

    SortTargetsByDistance(args);
}

export function InParentEntities(predicate: any) {
    return Object.values(parent.entities).filter(predicate); 
}

export function SortTargetsByDistance(args: CombatActionArgs) {
    if(!args.PotentialTargets) return;

    args.PotentialTargets.sort((current: Entity, next: Entity) => {
        var dist_current = distance(character, current);
        var dist_next = distance(character, next);
        // Else go to the 2nd item
        if (dist_current < dist_next) {
            return -1;
        }
        else if (dist_current > dist_next) {
            return 1
        }
        else {
            return 0;
        }
    });
}