import { D } from "./Debug";

import { IEntity } from "GameDefinitions/IEntity";
import { IMonster } from "GameDefinitions/IMonster";
import { gameEvents } from "./Event";
import { Vector } from "./Vector";
import { Combat } from "./Combat";

export interface ITargetArgs {
    CombatTarget?: IEntity | undefined;
    CombatTargetVector?: Vector;
    PotentialTargets?: IEntity[];
    TargetFilters?: [ (target: IEntity) => boolean ];
}

export class Target {
    constructor(args: ITargetArgs) {
        Object.assign(this, args);
    }

    public CombatTarget?: IEntity | undefined;
    public CombatTargetVector?: Vector;
    public PotentialTargets?: IEntity[];
    public TargetFilters: [ (target: IEntity) => boolean ] = [ () => true ];
    // const filteredTargets = targets.filter((t) => t.max_hp > 200)

    public MonsterFilter(monster: IMonster): boolean {
        return monster.max_hp > 200;
    }

    public SetActionTarget(action: Combat): IEntity | undefined {
        if (this.CombatTarget) {
            action.CombatTarget = this.CombatTarget;

            D.DebugError("Target acqured " + action.CombatTarget.name);
            return action.CombatTarget;
        }

    }

    public AcquireTargets() {

        const currentTarget = this.CombatTarget;

        //if (this.CombatTarget !== undefined) { return; }

        this.FilterTargetsAndHostiles();

        if (this.PotentialTargets && this.PotentialTargets.length > 0) {
            this.CombatTarget = this.PotentialTargets[0];

            if (this.CombatTarget && this.CombatTarget.going_x && this.CombatTarget.going_y) {
                this.CombatTargetVector = new Vector(this.CombatTarget.going_x, this.CombatTarget.going_y);
            }

            D.DebugInfo("Target set: " + this.CombatTarget.name +
                        " at distance " + distance(character, this.CombatTarget));
        }

        if (this.CombatTarget && (this.CombatTarget != currentTarget)) {
            gameEvents.emit("TargetAcquired", this.CombatTarget);
            change_target(this.CombatTarget);
        } else if (!this.CombatTarget) {
            set_message("No eligible targets");
        }

        this.MarkPotentialTargets();
    }
    
    public MarkPotentialTargets() {
        if (D.Drawing()) {
            clear_drawings();

            if (this.PotentialTargets) {
                for (const monster of this.PotentialTargets) {
                    if (monster.real_x && monster.real_y) {
                        draw_circle(monster.real_x, monster.real_y, character.range);
                    }
                }
            }

            if (this.CombatTarget) {
                if (character.real_x && character.real_y && this.CombatTarget.real_x && this.CombatTarget.real_y) {
                    draw_line(character.real_x, character.real_y, this.CombatTarget.real_x, this.CombatTarget.real_y);
                }
            }
        }
    }

    // Default to true if no filter provided
    public FilterTargetsAndHostiles() {

        let targets = this.InParentEntities((e: IMonster) => (e.type === "monster"));

        if (targets) {
            this.TargetFilters.forEach(tFilter => {
                targets = targets.filter((t) => tFilter(t));
            })
        }

            //     for (const monsterData of this.MonsterFilter) {

            //         if (t.mtype && t.mtype.match(monsterData)) {
            //             if(this.IsTargetingNothing(t)){
            //                 D.DebugVerbose("Filtering " + t.mtype + " to " + monsterData);
            //                 return true;
            //             }
            //         } 
                    
            //     }

            //     if (this.IsTargetingFriendly(t) || t.cooperative === true) {
            //         return true;
            //     }
            // });
        

        this.PotentialTargets = targets;

        D.DebugInfo("Found " + targets.length + " eligible targets");

        this.SortTargetsByHostilityThenDistance();
    }

    public SortTargetsByHostilityThenDistance() {
        if (!this.PotentialTargets) { return; }

        this.PotentialTargets.sort((current: IEntity, next: IEntity) => {
            if (this.IsTargetingFriendly(current)) {
                if (this.IsTargetingFriendly(next)) {
                    const currentHP = current.hp / current.max_hp;
                    const nextHP = next.hp / next.max_hp;

                    if (currentHP < nextHP) {
                        return -1;
                    } else {
                        return 0;
                    }
                } else {
                    return -1;
                }
            } else {
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
            }
        });
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

    public InParentEntities(predicate: any) {
        return Object.values(parent.entities).filter(predicate);
    }
}
