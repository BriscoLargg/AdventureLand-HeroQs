import { Entity, SkillInfo } from "definitions/game";
import { GetNearestTarget } from "../../Base/Target";
import { RepeatingAction, RepeatingActionArgs } from "../RepeatingAction";
import { D } from "../../Base/Debug";
import { Action } from "../Action";

const AUTO_ATTACK_DELAY = 200;

export class CombatActionArgs extends RepeatingActionArgs {
    CombatMode: boolean = true;
    CombatTarget?: Entity | undefined;
    MonsterFilter?: string[];
    MonsterParams?: any;
    PotentialTargets?: Entity[];
    SearchAndDestroy: boolean = false;
    Skill?: SkillInfo;
}

export class CombatAction extends RepeatingAction {
    constructor(args: CombatActionArgs) {
        super(args);
        this.Args = args;
        this.Action = this.AutoCombat;
        
        if(this.Args.Skill) {
            this.Args.DelayInMS = this.Args.Skill.cooldown;
            this.Name = this.Args.Skill.name;
        }
        else {
            this.Args.DelayInMS = AUTO_ATTACK_DELAY;
            this.Name = "AutoAttack";
        }
    }

    Args: CombatActionArgs;

    
    ToggleCombat() {
        this.Args.CombatMode ? this.Args.CombatMode = false : this.Args.CombatMode = true;	
    }

    Attack(target: Entity) {
        if(this.Args.Skill) {
            set_message(this.Args.Skill.name);
            use_skill(this.Args.Skill.name, target);   
        }
        else {
            set_message("AutoAttack");
            attack(target);
        }
    }

    Approach(target: Entity) {
        smart_move(target);
    }

    ApproachAndAttack(target: Entity) {
        if(this.CanApproach(target)) {
            this.Approach(target);
        }

        if(this.CanAttack(target)) {
            this.Attack(target);
        }
    }

    CanApproach(target: Entity) {
        return !in_attack_range(target) && this.Args.SearchAndDestroy;
    }

    CanAttack(target: Entity) {
        return can_attack(target);
    }

    AutoCombat() {
        if(!this.Args) D.DebugError("CombatActionArgs are undefined");
        if(!this.Action) return;
		if(this.IsCombatEnded()) return;
        
        if(this.Args.CombatTarget == undefined || this.Args.CombatTarget.dead != false) { 
            GetNearestTarget(this.Args);
        }
        
        if(this.Args.CombatTarget) {
            this.ApproachAndAttack(this.Args.CombatTarget);
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