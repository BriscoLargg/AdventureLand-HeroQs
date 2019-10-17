import { D } from "./Debug";

import { IEntity } from "GameDefinitions/IEntity";
import { Vector } from "./Vector";

import * as PF from "pathfinding";
import { events } from "./Event";

export class Movement {
    constructor() {
        events.on("TargetAcquired", (target) => { this.Reposition(target); });
    }

    public CharP: Vector = new Vector(0, 0);
    // public Grid: PF.Grid = new PF.Grid();
    public LastMove: number = Date.now();
    public Pathfinding: boolean = false;
    public PreferredTarget: string = "";
    public Target?: IEntity;
    public TargetV: Vector = new Vector(0, 0);

    public SetPreferredTarget(mtype: string) {
        this.PreferredTarget = mtype;
    }

    public Reposition(target: IEntity) {
        if (Date.now() - this.LastMove > 2000) {
            this.SetTargetPosition(target);
            this.PathToTarget();
            this.LastMove = Date.now();
        }
    }

    public SetTargetPosition(target: IEntity) {
        if (character.real_x && character.real_y) {
            this.CharP.set(character.real_x, character.real_y);
        }

        if (target) {
            this.Target = target;

            // D.DebugCritical("Updating Target Position");

            if (this.Target.real_x && this.Target.real_y) {
                this.TargetV = new Vector(this.Target.real_x, this.Target.real_y);
                this.TargetV = this.TargetV.subtract(this.CharP);
            }
        } else {

            D.DebugCritical("Can't Find Target Position");

            this.Target = character;
            this.TargetV.set(this.CharP.x, this.CharP.y);
        }
    }

    public PathToTarget() {
        if (this.Target) {
            let range = character.range;
            let targetDistance = distance(character, this.Target);
            let ratio = range / targetDistance;

            if (ratio > 8 || ratio < 1) {

                let destination: Vector = this.TargetV.clone();
                destination = destination.multiply(ratio);

                destination = destination.add(this.CharP);

                move(destination.x, destination.y);
            }

        }/* else {
            if (!is_moving(character) && !this.Pathfinding && this.PreferredTarget !== "") {
                this.Pathfinding = true;
                D.DebugCritical("Try to smart move to " + this.PreferredTarget);
                smart_move(this.PreferredTarget, () => this.Pathfinding = false);
            }
        }*/
    }

    /*public canPathToTarget() {
        return can_move_to(this.DestinationP.x, this.DestinationP.y);
    }*/

    public noop() {
        // Noop
    }

}
/*
	let myX: number | undefined = character.real_x;
	let myY: number | undefined = character.real_y;
	let theirX: number | undefined = target.real_x;
	let theirY: number | undefined = target.real_x;

	if(myX === undefined || myY === undefined ||
		theirX === undefined || theirY === undefined)	return;*/

    // smart_move(myX+(theirX-myX)/2, myY+(theirY-myY)/2);
