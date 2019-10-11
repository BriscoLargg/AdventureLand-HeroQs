import { RepeatingActionArgs } from "../Actions/RepeatingActionArgs";
import { Movement } from "../Base/Movement";
import { Target } from "../Target/Target";

export class CombatStackArgs extends RepeatingActionArgs {
    constructor(target: Target, move: Movement) {
        super();

        this.TargetingSolution = target;
        this.TargetPositioning = move;
    }

    public CombatEnabled: boolean = true;
    public MaintainDistance?: boolean = false;
    public TargetPositioning: Movement;
    public TargetingSolution: Target;
    public SearchAndDestroy: boolean = false;
}
