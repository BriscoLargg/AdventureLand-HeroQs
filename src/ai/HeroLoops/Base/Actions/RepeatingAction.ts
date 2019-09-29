import { Action, ActionArgs } from "./Action";
import { D } from "../Debug";

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
    
    Invoke() {
        if(this.IsRepeating()) {
            D.DebugVerbose("Repeat: " + this.Name + " after " + this.Args.DelayInMS + "ms");
            setTimeout(() => this.PushSelfToQueue(this.Args.Queue), this.Args.DelayInMS);
        }
        
        super.Invoke();
    }

    IsRepeating() {
        D.DebugVerbose("Check repeat " + this.Name + " at " + this.Args.TickCount);
        return (this.Args && this.Args.DelayInMS && this.Args.Queue);
    }
}