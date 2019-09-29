import { Entity } from "definitions/game";
import { CombatActionArgs } from "./Actions/CombatAction";

export function InParentEntities(predicate: any) {
    return Object.values(parent.entities).filter(predicate); 
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

export function GetNearestTarget(args: CombatActionArgs) {
    if(args == undefined) return;
    
    set_message("Seeking target...");
    
    //target=get_nearest_hostile(params);
    args.CombatTarget = get_nearest_monster(args.MonsterParams);
    if(args.CombatTarget && args.CombatTarget) change_target(args.CombatTarget);
    else
    {
        set_message("No eligible targets");
    }

}