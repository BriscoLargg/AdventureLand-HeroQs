import { ActionQueue } from "../Actions/ActionQueue";
import { D } from "../Base/Debug";
import { ActionArgs } from "../Actions/ActionArgs";

export class CombatStack extends ActionQueue {
    constructor(args: ActionArgs) {
        super(args);

        this.TickInMS = 200;
        this.Name = "CombatStack";
    }

    public GetNext() {
        const action = this.pop();
        if (action) { D.DebugInfo("OH YEAH TIME TO FIGHT " + action.Name); }
        return action;
    }
}