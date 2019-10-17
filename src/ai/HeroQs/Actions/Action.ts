import { ActionQueue } from "ai/HeroQs/Actions/ActionQueue";

export class Action {
    constructor(delegate?: any) {
        this.Action = delegate;

        if (delegate && delegate.name) {
            this.Name = delegate.name;
        }
    }

    public Action: any;
    public DelayInMS: number = 250;
    public Name: string = "";
    public TickCount: number = 1;

    public Invoke(queue?: ActionQueue) {
        this.Action();
    }

    public PushToQueue(queue: ActionQueue) {
        queue.push(this);
    }

    public static Create() {
        return new Action();
    }
}
