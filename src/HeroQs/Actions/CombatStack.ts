import { D } from "../Base/Debug";

import { IEntity } from "GameDefinitions/IEntity";
import { ActionQueue } from "./ActionQueue";
import { Combat } from "../Base/Combat";

import { gameEvents } from "../Base/Event";
import { Movement } from "../Base/Movement";
import { Target } from "../Base/Target";


export class CombatStack extends ActionQueue {
    constructor(target: Target, move: Movement) {
        super();

        this.Name = "CombatStack";

        this.TargetPositioning = move;
        this.TargetingSolution = target;

        this.Action = this.UpdateTargeting;

        this.AddEvents();

    }

    public Actions: Combat[] = [];
    public CurrentTarget?: IEntity;
    public CombatEnabled: boolean = true;
    public MaintainDistance?: boolean = false;
    public TargetPositioning: Movement;
    public TargetingSolution: Target;
    public SearchAndDestroy: boolean = false;

    private AddEvents() {
        gameEvents.on("ToggleCombat", this.ToggleCombat);
        gameEvents.on("ResupplyInProgress", () => this.CombatEnabled = false );
        // events.on("ResupplyInProgress", () => set_message("Combat Paused"));
        gameEvents.on("ResupplyEnded", () => this.CombatEnabled = true );
        // events.on("ResupplyEnded", () => set_message("Combat Resumed"));

        gameEvents.on("TargetAcquired", (target) => {
            D.DebugCritical("TargetAcquiredEvent");
            this.CurrentTarget = target;
        });
    }

    public UpdateTargeting() {
        this.TargetingSolution.AcquireTargets();
        // this.TargetPositioning.SetPreferredTarget(this.TargetingSolution.GetPreferredTarget());
    }

    public pop(): Combat | undefined {
        const action = this.Actions.pop();
        if (action) {
            action.CombatEnabled = this.CombatEnabled;
            // this.Args.TargetingSolution.SetActionTarget(action);
            // action.CombatTarget = this.CurrentTarget;
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
        this.CombatEnabled ? this.CombatEnabled = false : this.CombatEnabled = true;
    }
}
