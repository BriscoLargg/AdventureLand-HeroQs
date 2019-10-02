import { ActionQueue } from "./ActionQueue";
import { D } from "./Debug";

export class CombatStack extends ActionQueue {
    constructor() {
        super();

        this.TickInMS = 200;
        this.Name = "CombatStack"
    }

    GetNext() {
        let action = this.pop();
        if(action) D.DebugInfo("OH YEAH TIME TO FIGHT " + action.Name);
        return action;
    }
}