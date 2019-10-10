import { D } from "../Base/Debug";

import { IEntity } from "GameDefinitions/IEntity";
import { SkillName } from "GameDefinitions/ISkill";
import { RepeatingAction } from "../Actions/RepeatingAction";
import { Movement } from "../Base/Movement";
import { CombatArgs } from "./CombatArgs";

const AUTO_ATTACK_DELAY = 250;

export class Combat extends RepeatingAction {
    constructor(args: CombatArgs) {
        super(args);
        this.Args = args;
        this.Action = this.AutoCombat;

        if (this.Args.Skill) {
            this.Args.DelayInMS = this.Args.Skill.cooldown;
            this.Name = this.Args.Skill.name;
        } else {
            this.Args.DelayInMS = AUTO_ATTACK_DELAY;
            this.Name = "AutoAttack";
        }
    }

    public Args: CombatArgs;
    public CombatTarget?: IEntity;

    public AutoCombat() {
        if (!this.Args) { D.DebugError("CombatActionArgs are undefined"); }
        if (this.IsCombatEnded()) { return; }

        if (this.CombatTarget) {
            this.ApproachAndAttack(this.CombatTarget);
        }
    }

    public IsCombatEnded() {
        if (!this.Args) { return; }
        return (!this.Args.CombatEnabled || character.rip || is_moving(character));
    }

    public Attack(target: IEntity) {
        if (this.Args.Skill.name === SkillName.attack) {
            set_message("AutoAttack");
            attack(target);
        } else {
            set_message(this.Args.Skill.name);
            use_skill(this.Args.Skill.name, target);
            D.DebugError("Using skill " + this.Args.Skill.name + " repeat " + this.Args.DelayInMS);
        }
    }

    public Approach(target: IEntity) {
        new Movement(target).Invoke();
    }

    public CanApproach(target: IEntity) {
        return !in_attack_range(target);
    }

    public CanAttack(target: IEntity) {
        return can_attack(target);
    }

    public ApproachAndAttack(target: IEntity) {
        if (this.CanApproach(target)) {
            this.Approach(target);
        }

        if (this.CanAttack(target)) {
            this.Attack(target);
        }
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
