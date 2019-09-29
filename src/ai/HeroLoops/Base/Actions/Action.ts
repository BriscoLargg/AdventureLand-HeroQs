import { BaseArgs } from "../Args";
import { ActionQueue } from "ai/HeroLoops/ActionQueue";

export class ActionArgs extends BaseArgs {
    DelayInMS: number = 250;
    Queue: ActionQueue | undefined;    
}

export class Action {
    constructor(args: ActionArgs, delegate?: any) {
        this.Action = delegate;
        this.Args = args;
    }

    Action: any;
    Args: ActionArgs;
    Name: string = "";


    Invoke() {
        this.Action(this.Args ? this.Action(this.Args) : this.Action());
    }

    PushSelfToQueue(queue: ActionQueue | undefined) {
        if(queue != undefined) {
            this.Args.Queue = queue;
            queue.Push(this);
        }
        else if(this.Args.Queue) {
            this.Args.Queue.Push(this);
        }       
    }
}