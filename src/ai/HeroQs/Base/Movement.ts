
import { Action } from "../Actions/Action";
import { ActionArgs } from "../Actions/ActionArgs";
import { IEntity } from "GameDefinitions/IEntity";
import { Vector } from "./Vector";

export class Movement extends Action {
    constructor(destination: IEntity) {
        super(new ActionArgs());

        this.Action = this.pathToTarget;

        if (destination) {
            this.Target = destination;

            if (this.Target.real_x && this.Target.real_y) {
                this.X = this.Target.real_x;
                this.Y = this.Target.real_y;
                this.TargetV = new Vector(this.X, this.Y);
            }
        } else {
            this.Action = this.noop;
        }
    }

    public Target!: IEntity;
    public X!: number;
    public Y!: number;
    public TargetV!: Vector;

    public approach_target_direct() {
        if (this.canPathToTarget()) {
            this.move();
        }
    }

    public pathToTarget() {
            move(this.X, this.Y);

    }

    public canPathToTarget() {
        return can_move_to(this.X, this.Y);
    }

    public move() {
            move(this.X, this.Y);
    }

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

	//smart_move(myX+(theirX-myX)/2, myY+(theirY-myY)/2);