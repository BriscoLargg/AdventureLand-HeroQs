import { D } from "../Base/Debug";

import { Action } from "./Action";
import { ActionQueue } from "./ActionQueue";
import { RepeatingActionArgs } from "./RepeatingActionArgs";

export class RepeatingAction extends Action {
    constructor(args: RepeatingActionArgs, delegate?: any, ms?: number) {
        super(args, delegate);
        this.Args = args;
        if (ms) {
            this.Args.DelayInMS = ms;
        }
    }

    public LastTick: number = 1;

    public Invoke(queue: ActionQueue) {
        if (this.IsRepeating()) {
            if (this.Name) { D.DebugError("Repeat: " + this.Name + " after " + this.Args.DelayInMS + "ms"); }
            setTimeout(() => this.PushToQueue(queue), this.Args.DelayInMS);
        }

        super.Invoke(queue);
    }

    public IsRepeating() {
        if (this.Name ) { D.DebugVerbose("Check repeat " + this.Name + " at " + this.Args.TickCount); }
        return (this.Args && this.Args.DelayInMS);
    }
}
