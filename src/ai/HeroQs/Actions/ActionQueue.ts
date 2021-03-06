import { D } from "../Base/Debug";

import { Action } from "./Action";
import { RepeatingAction } from "./RepeatingAction";

export class ActionQueue extends RepeatingAction {
    constructor() {
        super();
    }

    public Actions: Action[] = [];
    public InvokingAction: Action | ActionQueue | undefined;
    public Name: string = "ActionQueue";
    public SecondsCount: number = 0;
    public TickCount: number = 1;
    public TickInMS: number = 1;

    // Overloaded array operators match casing of underlying object
    public push(action: Action) {
        if (action) { this.Actions.push(action); }
    }

    public pop(): Action | undefined {
        const action = this.Actions.pop();
        if (action) {
            return action;
        } else { return undefined; }
    }

    public shift(): Action | undefined {
        const action = this.Actions.shift();
        if (action) {
            return action;
        } else { return undefined; }
    }

    public length() {
        return this.Actions.length;
    }

    public IsReady() {
        D.DebugInfo("Found " + this.Actions.length + " actions");
        return (this.Actions.length > 0);
    }

    public Start() {
        D.DebugCheck();

        setInterval(() => {
            if (this.Actions.length > 0 ) {
                this.GetNextAndInvoke();
            }
            this.TickCount = this.TickCount += this.TickInMS;
        }, this.TickInMS);
    }

    public GetNext() {
        const action = this.shift();
        return action;
    }

    public Load(actions: Action[]) {
        actions.forEach((a) => {
            a.PushToQueue(this);
        });
    }

    public Invoke(queue: ActionQueue) {
        if (this.Action) {
            this.Action();
        }
        this.PushToQueue(queue);
        this.GetNextAndInvoke();
    }

    public PushToQueue(action: ActionQueue) {
        D.DebugInfo("Repeat whole queue/stack: " + action.Name + " after " + action.DelayInMS + "ms");
        setTimeout(() => action.push(this), action.DelayInMS);
    }

    public GetNextAndInvoke() {
        this.InvokingAction = undefined;
        if (this.IsReady()) {
            this.InvokingAction = this.GetNext();
            if (this.InvokingAction === undefined) { D.DebugError("Queue is Empty, IsReady is broken"); }

            if (this.InvokingAction) {
                D.CC("Exec " +
                    this.InvokingAction + " " +
                    this.InvokingAction.Name + " at tick: " +
                    this.TickCount +
                    " w/CC: " + character.cc
                );

                this.InvokingAction.Invoke(this);
            }
        }
    }
}
