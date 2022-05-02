import { D } from "../Base/Debug";

import { Action } from "./Action";
import { ActionQueue } from "./ActionQueue";

export class RepeatingAction extends Action {
    constructor(delegate?: any, ms?: number) {
        super(delegate);

        if (ms) {
            this.DelayInMS = ms;
        }
    }

    public LastTick: number = 1;
    public Repeat: boolean = true;

    public Invoke(queue: ActionQueue) {
        if (this.IsRepeating()) {
            if (this.Name) { D.DebugInfo("Repeat: " + this.Name + " after " + this.DelayInMS + "ms"); }
            setTimeout(() => this.PushToQueue(queue), this.DelayInMS);
        }

        super.Invoke(queue);
    }

    public IsRepeating() {
        if (this.Name ) { D.DebugVerbose("Check repeat " + this.Name + " at " + this.TickCount); }
        return (this.Repeat);
    }
}
