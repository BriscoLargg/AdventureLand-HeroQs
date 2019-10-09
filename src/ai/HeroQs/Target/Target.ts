import { D } from "../Base/Debug";

import { IEntity } from "GameDefinitions/IEntity";
import { IMonster } from "GameDefinitions/IMonster";
import { Vector } from "../Base/Vector";
import { Combat } from "../Combat/Combat";
import { TargetArgs } from "./TargetArgs";

export class Target {
    constructor(args: TargetArgs) {

        this.Args = args;
    }

    public Args: TargetArgs;

    public SetActionTarget(action: Combat): IEntity | undefined {
        if (this.Args.CombatTarget) {
            action.CombatTarget = this.Args.CombatTarget;

            D.DebugError("Target acqured " + action.CombatTarget.name);
            return action.CombatTarget;
        }

    }

    public AcquireTargets() {
        this.GetBestTarget(this.Args);
    }

    public GetBestTarget(args: TargetArgs) {
        if (args === undefined) { return; }
        /*(if (args.CombatTarget && args.CombatTarget.dead) {
            args.CombatTarget = undefined;
        }*/

        this.MarkPotentialTargets(args);

        // if (args.CombatTarget !== undefined) { return; }
        set_message("Seeking target...");

        this.FilterPotentialTargetsForNearest(args);

        if (args.CombatTarget) {
            change_target(args.CombatTarget);
        } else {
            set_message("No eligible targets");
        }

        if (args.PotentialTargets && args.PotentialTargets.length > 0) {
            args.CombatTarget = args.PotentialTargets[0];

            if (args.CombatTarget && args.CombatTarget.going_x && args.CombatTarget.going_y) {
                args.CombatTargetVector = new Vector(args.CombatTarget.going_x, args.CombatTarget.going_y);
            }

            D.DebugInfo("Target set: " + args.CombatTarget.name +
                        " at distance " + distance(character, args.CombatTarget));
        }
    }

    public MarkPotentialTargets(args: TargetArgs) {
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

    public IsTargetingFriendly(target: IEntity) {
        return (this.IsTargetingParty(target) || this.IsTargetingMe(target));
    }

    public IsTargetingParty(target: IEntity) {
        return (parent.party_list.includes(target.target));
    }

    public IsTargetingMe(target: IEntity) {
        return (target.target === character.name);
    }

    public IsTargetingNothing(target: IEntity) {
        return (target.target == null);
    }

    // Default to true if no filter provided
    public FilterPotentialTargetsForNearest(args: TargetArgs) {

        let targets = this.InParentEntities((e: IMonster) => (e.type === "monster"));

        if (targets) {
            targets = targets.filter((t) => {
                if (this.IsTargetingMe(t) || this.IsTargetingNothing(t) || this.IsTargetingParty(t)) {
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

        this.SortTargetsByDistance(args);
    }

    public InParentEntities(predicate: any) {
        return Object.values(parent.entities).filter(predicate);
    }

    public SortTargetsByDistance(args: TargetArgs) {
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
}
