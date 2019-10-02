import { CombatAction, CombatActionArgs } from "../Actions/CombatActions/CombatAction";
import { Action, ActionArgs } from "../Actions/Action";
import { RepeatingAction, RepeatingActionArgs } from "../Actions/RepeatingAction";
import { D } from "./Debug";

export class ActionQueue {
	Actions: (Action | ActionQueue)[] = [];
	DelayInMS: number = 100;
	InvokingAction: Action | ActionQueue | undefined;
	Name: string = "ActionQueue"
	SecondsCount: number = 0;
	TickCount: number = 1;
	TickInMS: number = 1;
	
	
	//Overloaded array operators match casing of underlying 
    push(action: Action | ActionQueue) {
		if(action) this.Actions.push(action);
	}
	
	pop(): Action | ActionQueue | undefined {
		let action = this.Actions.pop();
		if(action) return action;
		else return undefined;
	}

    shift(): Action | ActionQueue | undefined {
		let action = this.Actions.shift();
		if(action) return action;
		else return undefined;
    }

    length() {
        return this.Actions.length;
    }

    IsReady() {
		D.DebugInfo("Found " + this.Actions.length + " actions");
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

	GetNext() {
		let action = this.shift();
		return action;
	}

	Invoke(queue: ActionQueue) {
		this.PushToQueue(queue);
		this.GetNextAndInvoke();
	}

	PushToQueue(action: ActionQueue) {
		D.DebugInfo("Repeat whole queue/stack: " + action.Name + " after " + action.DelayInMS + "ms");
		setTimeout(() => action.push(this), action.DelayInMS);
	}

    GetNextAndInvoke() {
		this.InvokingAction = undefined;
        if(this.IsReady()) {
			this.InvokingAction = this.GetNext();
			if(this.InvokingAction == undefined) D.DebugError("Queue is Empty, IsReady is broken");
			
			if(this.InvokingAction) {
				D.DebugVerbose("Exec " + 
								this.InvokingAction + " " + 
								this.InvokingAction.Name + " at tick: " + 
								this.TickCount + 
								" w/CC: " + character.cc
								);
				this.InvokingAction.Invoke(this);
			}
        }           
    }
}