import { CombatAction, CombatActionArgs } from "./Base/Actions/CombatAction";
import { Action, ActionArgs } from "./Base/Actions/Action";
import { RepeatingAction, RepeatingActionArgs } from "./Base/Actions/RepeatingAction";
import { D } from "./Base/Debug";

export class ActionQueue {
	Actions: Action[] = [];
    SecondsCount: number = 0;
	TickCount: number = 1;
	TickInMS: number = 1;
	InvokingAction: Action | undefined;
    
    Push(action: Action) {
		action.Args.Queue = this;
        this.Actions.push(action);
    }

    Shift() {
        return this.Actions.shift();
    }

    Length() {
        return this.Actions.length;
    }

    IsReady() {
		D.DebugVerbose("Found " + this.Actions.length + " actions");
        return (this.Actions.length > 0);
	}
	
	Start() {

		D.DebugCheck();

		setInterval(() => {
			if(this.Actions.length > 0 ) {
				this.GetNextAndInvoke();
			}
			this.TickCount = this.TickCount += this.TickInMS;
		},this.TickInMS);
	}	

    GetNextAndInvoke() {
		this.InvokingAction = undefined;
        if(this.IsReady()) {
			this.InvokingAction = this.Actions.shift();
			if(this.InvokingAction == undefined) D.DebugError("Queue is Empty, IsReady is broken");
			
			if(this.InvokingAction) {
				D.DebugVerbose("Exec " + 
								this.InvokingAction + " " + 
								this.InvokingAction.Name + " at tick: " + 
								this.TickCount + 
								" w/CC: " + character.cc
								);
				this.InvokingAction.Invoke();
			}
        }           
    }
}