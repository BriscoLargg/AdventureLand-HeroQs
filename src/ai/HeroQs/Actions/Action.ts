import { BaseArgs } from "../Base/Args";
import { ActionQueue } from "ai/HeroQs/Base/ActionQueue";

export class ActionArgs extends BaseArgs {
    DelayInMS: number = 250;
    //Queue: ActionQueue = new ActionQueue();    
}

export class Action {
    constructor(args: ActionArgs, delegate?: any) {
        this.Action = delegate;
        this.Args = args;
        
        if(delegate && delegate.name) {
            this.Name = delegate.name;
        }
    }

    Action: any;
    Args: ActionArgs;
    Name: string = "";


    Invoke(queue: ActionQueue) {
        this.Args ? this.Action(this.Args) : this.Action();
    }

    PushToQueue(queue: ActionQueue) {
        queue.push(this);  
    }

    static Create() {
        return new Action(new ActionArgs())
    }
}