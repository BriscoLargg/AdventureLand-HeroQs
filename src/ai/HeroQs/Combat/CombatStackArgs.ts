import { RepeatingActionArgs } from "../Actions/RepeatingActionArgs";
import { Target } from "../Target/Target";

export class CombatStackArgs extends RepeatingActionArgs {
    constructor(target: Target) {
        super();

        this.TargetingSolution = target;
    }

    public CombatEnabled: boolean = true;
    public MaintainDistance?: boolean = false;
    public TargetingSolution: Target;
    public SearchAndDestroy: boolean = false;
}
