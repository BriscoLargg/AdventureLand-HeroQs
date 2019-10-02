import { Action, ActionArgs } from "./Action";
import { D } from "../Base/Debug";
import { ActionQueue } from "../Base/ActionQueue";

export class RepeatingActionArgs extends ActionArgs {
    Repeat: boolean = true;
}

export class RepeatingAction extends Action {
    constructor(args: RepeatingActionArgs, delegate?: any, ms?: number) {
        super(args, delegate);
        this.Args = args;
        if(ms) {
            this.Args.DelayInMS = ms;
        }
    }

    LastTick: number = 1; 
    
    Invoke(queue: ActionQueue) {
        if(this.IsRepeating()) {
            D.DebugError("Repeat: " + this.Name + " after " + this.Args.DelayInMS + "ms");
            setTimeout(() => this.PushToQueue(queue), this.Args.DelayInMS);
        }
        
        super.Invoke(queue);
    }

    IsRepeating() {
        D.DebugVerbose("Check repeat " + this.Name + " at " + this.Args.TickCount);
        return (this.Args && this.Args.DelayInMS);
    }
}