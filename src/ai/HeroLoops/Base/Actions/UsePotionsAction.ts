import { RepeatingAction, RepeatingActionArgs } from "./RepeatingAction";
import { D } from "../Debug";

export class UsePotionActionArgs extends RepeatingActionArgs {
    
}

export class UsePotionsAction extends RepeatingAction {
    constructor(args: RepeatingActionArgs) {
        super(args, 200);
        this.Args = args;
        this.Action = this.UseHPOrMP;
    }

    Args: RepeatingActionArgs;
    LastPotion: Date = new Date();
    Name: string = "UsePotions";
    MissingHP: number = character.max_hp - character.hp;
    MissingMP: number = character.max_mp - character.mp;
    RemainingPercentMP: number = character.mp/character.max_mp;
    RemainingPercentHP: number = character.hp/character.max_hp;

    UpdateStats() {
        this.MissingHP = character.max_hp - character.hp;
        this.MissingMP = character.max_mp - character.mp;
        //this.RemainingPercentMP = character.mp/character.max_mp;
        //this.RemainingPercentHP = character.hp/character.max_hp;
        D.DebugVerbose("MissingHP: " + this.MissingHP + "  MissingMP: " + this.MissingMP);
    }

    UseHPOrMP(){ 
        var used=false;
        if( new Date() < parent.next_skill.use_hp) return;
        this.UpdateStats();   
        

        if(this.MissingHP > 200 ) use('use_hp'),used=true; 
        else if(this.MissingMP > 300) use('use_mp'),used=true;
        //else if(character.hp<character.max_hp) use('use_hp'),used=true;
        //else if(character.mp<character.max_mp) use('use_mp'),used=true;

        if(used) {
            D.DebugInfo("Last Potion used at " + this.LastPotion);
            this.LastPotion=new Date();
        } 
    }

    
}