import { Entity, } from "definitions/game";
import { GetNearestTarget } from "../Target";
import { RepeatingAction, RepeatingActionArgs } from "./RepeatingAction";
import { D } from "../Debug";

export class CombatActionArgs extends RepeatingActionArgs {
    CombatMode: boolean = true;
    CombatTarget?: Entity | undefined;
    MonsterFilter?: string[];
    MonsterParams?: any;
    PotentialTargets?: Entity[];
}

export class CombatAction extends RepeatingAction {
    constructor(args: CombatActionArgs) {
        super(args, 200);
        this.Args = args;
        this.Action = this.AutoCombat;
    }

    Args: CombatActionArgs;

    ToggleCombat() {
        this.Args.CombatMode ? this.Args.CombatMode = false : this.Args.CombatMode = true;	
    }
        
    findViableTargets() {
    }
    
    //Default to true if no filter provided
    IsFilteredMonster(target: Entity) {
        if(this.Args.MonsterFilter == undefined) return true;
        if(target == undefined || target.mtype == undefined) return false;
        return (this.Args.MonsterFilter.includes(target.mtype));
    }

    ApproachAndAutoAttack() {
        if(!this.Args || this.Args.CombatTarget == undefined) return;

        if(can_attack(this.Args.CombatTarget)) {
            set_message("AutoAttack");
            attack(this.Args.CombatTarget);
        }
        else if(!in_attack_range(this.Args.CombatTarget))
        {
            smart_move(this.Args.CombatTarget);
        }
    }

    AutoCombat() {
        if(!this.Args) D.DebugError("CombatActionArgs are undefined");
        if(!this.Action) return;
		if(this.IsCombatEnded()) return;
        
        if(!this.Args.CombatTarget || this.Args.CombatTarget.dead != false) { 
            GetNearestTarget(this.Args);
        }
        
        //D.DebugInfo(args.ToString());

        if(this.Args.CombatTarget != undefined) {
            this.ApproachAndAutoAttack();
        }
    }

    IsCombatEnded() {
        if(!this.Args) return;
        return (!this.Args.CombatMode || character.rip || is_moving(character));
    }
}

/*
//Returns an ordered array of all relevant targets as determined by the following:
////1. The monsters' type is contained in the 'monsterTargets' array.
////2. The monster is attacking you or a party member.
////3. The monster is not targeting someone outside your party.
//The order of the list is as follows:
////Monsters attacking you or party members are ordered first.
////Monsters are then ordered by distance.
function find_viable_targets() {
    var monsters = Object.values(parent.entities).filter(
        mob => (mob.target == null
                    || parent.party_list.includes(mob.target)
                    || mob.target == character.name)
                && (mob.type == "monster"
                    && (parent.party_list.includes(mob.target)
                        || mob.target == character.name))
                    || monster_targets.includes(mob.mtype));

    for (id in monsters) {
        var monster = monsters[id];

        if (parent.party_list.includes(monster.target)
                    || monster.target == character.name) {
            monster.targeting_party = 1;
        }
        else {
            monster.targeting_party = 0;
        }
    }

    //Order monsters by whether they're attacking us, then by distance.
    monsters.sort(function (current, next) {
        if (current.targeting_party > next.targeting_party) {
            return -1;
        }
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
    return monsters;
}*/