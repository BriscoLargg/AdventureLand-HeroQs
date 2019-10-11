import { D } from "../Base/Debug";

import { IEntity } from "GameDefinitions/IEntity";
import { ActionQueue } from "../Actions/ActionQueue";
import { Movement } from "../Base/Movement";
import { Combat } from "./Combat";
import { CombatStackArgs } from "./CombatStackArgs";

export class CombatStack extends ActionQueue {
    constructor(args: CombatStackArgs) {
        super(args);

        this.Args = args;

        this.Args.DelayInMS = 250;
        this.Name = "CombatStack";

        this.Action = () => { this.Args.TargetingSolution.AcquireTargets(); };
    }

    public Args: CombatStackArgs;
    public Actions: Combat[] = [];
    public CurrentTarget?: IEntity;

    public pop(): Combat | undefined {
        const action = this.Actions.pop();
        if (action) {
            if (this.CurrentTarget && this.CurrentTarget.dead) {
                this.CurrentTarget = undefined;
            }
            action.Args.CombatEnabled = this.Args.CombatEnabled;
            this.Args.TargetingSolution.SetActionTarget(action);
            this.CurrentTarget = action.CombatTarget;

            if (this.CurrentTarget) { this.Args.TargetPositioning.SetTargetPosition(this.CurrentTarget); }
        }
        return action;
    }

    public unshift(action: Combat) {
        if (action) { this.Actions.push(action); }
    }

    public GetNext() {
        const action = this.pop();
        return action;
    }

    public ToggleCombat() {
        this.Args.CombatEnabled ? this.Args.CombatEnabled = false : this.Args.CombatEnabled = true;
    }
}
