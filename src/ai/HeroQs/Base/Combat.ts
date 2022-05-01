import { D } from "./Debug";

import { IEntity } from "GameDefinitions/IEntity";
import { RepeatingAction } from "../Actions/RepeatingAction";

import G_skills from "../../../GameDefinitions/G/skills.json";
import { gameEvents } from "./Event";
import { Skill } from "./Skill";

const AUTO_ATTACK_DELAY = 250;

export class Combat extends RepeatingAction {
    constructor(skill: string) {
        super();

        this.Action = this.AutoCombat;
        this.Skill = new Skill(skill);

        D.DebugCritical(this.Skill.name);

        if (this.Skill.name === "attack") {
            this.DelayInMS = AUTO_ATTACK_DELAY;
            this.Name = "AutoAttack";
        } else {
            this.DelayInMS = this.Skill.cooldown;
            this.Name = this.Skill.name;
        }

        gameEvents.on("TargetAcquired", (target) => {
            this.CombatTarget = target;
        });
    }

    public CombatEnabled: boolean = false;
    public CombatTarget?: IEntity;
    public Skill: Skill;

    public AutoCombat() {
        if (this.IsCombatEnded()) { return; }

        if (this.CombatTarget && this.CanAttack(this.CombatTarget)) {
            this.Attack(this.CombatTarget);
        }
    }

    public IsCombatEnded() {
        return (!this.CombatEnabled || character.rip || is_moving(character));
    }

    public Attack(target: IEntity) {
        if (this.Skill.name === "attack") {
            set_message("AutoAttack");
            attack(target);
        } else {
            set_message(this.Skill.name);
            use_skill(this.Skill.name, target);
            D.DebugError("Using skill " + this.Skill.name + " repeat " + this.DelayInMS);
        }
    }

    public CanAttack(target: IEntity) {
        return can_attack(target);
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
