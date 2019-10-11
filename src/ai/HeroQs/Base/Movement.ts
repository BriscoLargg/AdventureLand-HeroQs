import { D } from "./Debug";

import { IEntity } from "GameDefinitions/IEntity";
import { RepeatingAction } from "../Actions/RepeatingAction";
import { RepeatingActionArgs } from "../Actions/RepeatingActionArgs";
import { Vector } from "./Vector";

export class Movement extends RepeatingAction {
    constructor(destination?: IEntity) {
        super(new RepeatingActionArgs());

        this.Action = this.ApproachTarget;
        this.Args.DelayInMS = 1000;
        this.Name = "Movement";
    }

    public CharacterV: Vector = new Vector(0, 0);
    public Target?: IEntity;
    public TargetV: Vector = new Vector(0, 0);
    public X!: number;
    public Y!: number;

    public SetTargetPosition(target: IEntity) {
        if (target) {
            this.Target = target;

            if (this.Target.real_x && this.Target.real_y) {
                this.X = this.Target.real_x;
                this.Y = this.Target.real_y;
                this.TargetV = new Vector(this.X, this.Y);
            }
        } else {
            this.Target = character;
            this.X = this.CharacterV.x;
            this.Y = this.CharacterV.y;
            this.TargetV = this.CharacterV;
        }
    }

    public ApproachTarget() {
        if (this.canPathToTarget()) {
            this.pathToTarget();
        } else {
            smart_move(this.Target);
        }
    }

    public pathToTarget() {
        if (this.Target) {
            if (character.real_x && character.real_y) {
                this.CharacterV = new Vector(character.real_x, character.real_y);

                const distance = character.range * 0.95;
                // const ratio = 
                const position = this.TargetV.vector_projection(this.CharacterV);

                if (D.Drawing()) {
                    draw_line(this.CharacterV.x, this.CharacterV.y, position.x, position.y);
                    draw_line(position.x, position.y, this.TargetV.x, this.TargetV.y);
                }

                move(position.x, position.y);
            }
        }
    }

    public canPathToTarget() {
        return can_move_to(this.X, this.Y);
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