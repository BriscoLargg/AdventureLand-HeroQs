import { IEntity } from "GameDefinitions/IEntity";
import { Vector } from "./Vector";

export function approach_target_direct(target: IEntity) {
    smart_move(target);
}

export function pathToTarget(target: IEntity | Vector | string ) {

}

	/* 
	let myX: number | undefined = character.real_x;
	let myY: number | undefined = character.real_y;
	let theirX: number | undefined = target.real_x;
	let theirY: number | undefined = target.real_x;

	if(myX === undefined || myY === undefined ||
		theirX === undefined || theirY === undefined)	return;*/

	//smart_move(myX+(theirX-myX)/2, myY+(theirY-myY)/2);