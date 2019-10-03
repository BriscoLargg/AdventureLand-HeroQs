import { D } from "./Debug";

import { IEntity } from "GameDefinitions/IEntity";
import { IMonster } from "GameDefinitions/IMonster";

import { CombatActionArgs } from "../Combat/CombatActionArgs";

export function GetNearestTarget(args: CombatActionArgs) {
    if (args === undefined) { return; }
    if (args.CombatTarget && args.CombatTarget.dead) {
        args.CombatTarget = undefined;
    }

    MarkPotentialTargets(args);

    if (args.CombatTarget !== undefined) { return; }
    set_message("Seeking target...");

    FilterPotentialTargetsForNearest(args);

    if (args.CombatTarget) {
        change_target(args.CombatTarget);
    } else {
        set_message("No eligible targets");
    }

    if (args.PotentialTargets && args.PotentialTargets.length > 0) {
        args.CombatTarget = args.PotentialTargets[0];
        D.DebugInfo("Target set: " + args.CombatTarget.name + " at distance " + distance(character, args.CombatTarget));
    }
}

export function MarkPotentialTargets(args: CombatActionArgs) {
    if (D.Drawing()) {
        clear_drawings();

        if (args && args.PotentialTargets) {
            for (const monster of args.PotentialTargets) {
                if (monster.real_x && monster.real_y) {
                    draw_circle(monster.real_x, monster.real_y, character.range);
                }
        }}

        if (args && args.CombatTarget) {
            if (character.real_x && character.real_y && args.CombatTarget.real_x && args.CombatTarget.real_y) {
                draw_line(character.real_x, character.real_y, args.CombatTarget.real_x, args.CombatTarget.real_y);
            }
        }
    }
}

export function IsTargetingFriendly(target: IEntity) {
    return (IsTargetingParty(target) || IsTargetingMe(target));
}

export function IsTargetingParty(target: IEntity) {
    return (parent.party_list.includes(target.target));
}

export function IsTargetingMe(target: IEntity) {
    return (target.target === character.name);
}

export function IsTargetingNothing(target: IEntity) {
    return (target.target == null);
}

// Default to true if no filter provided
export function FilterPotentialTargetsForNearest(args: CombatActionArgs) {

    let targets = InParentEntities((e: IMonster) => (e.type === "monster"));

    if(targets) {
       targets = targets.filter((t) => {
            if (IsTargetingMe(t) || IsTargetingNothing(t) || IsTargetingParty(t)) {
                if (args.MonsterFilter === undefined || args.MonsterFilter.length === 0) { return true; }
                for (const type of args.MonsterFilter) {
                    if (type === t.mtype) {
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
    if (!args.PotentialTargets) { return; }

    args.PotentialTargets.sort((current: IEntity, next: IEntity) => {
        const distanceCurrent = distance(character, current);
        const distanceNext = distance(character, next);
        // Else go to the 2nd item
        if (distanceCurrent < distanceNext) {
            return -1;
        } else if (distanceCurrent > distanceNext) {
            return 1;
        } else {
            return 0;
        }
    });
}
