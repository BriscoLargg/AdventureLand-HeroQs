import { ActionQueue } from "ai/HeroQs/Actions/ActionQueue";
import { ActionArgs } from "./ActionArgs";

export class Action {
    constructor(args: ActionArgs, delegate?: any) {
        this.Action = delegate;
        this.Args = args;

        if (delegate && delegate.name) {
            this.Name = delegate.name;
        }
    }

    public Action: any;
    public Args: ActionArgs;
    public Name: string = "";

    public Invoke(queue: ActionQueue) {
        this.Args ? this.Action(this.Args) : this.Action();
    }

    public PushToQueue(queue: ActionQueue) {
        queue.push(this);
    }

    public static Create() {
        return new Action(new ActionArgs());
    }
}
