export interface SkillInfo {
  mp?: number;
  name: string;
  cooldown: number;
  ratio?: number;
  range?: number;
}

export class Supershot implements SkillInfo {
    name: string = "supershot"
    cooldown: number = 30000
}

export class HuntersMark implements SkillInfo {
    name: string = "huntersmark";
    cooldown: number = 10000;
}

/*
export type SkillName =
  | "use_town"
  | "move_right"
  | "blink"
  | "mluck"
  | "gm"
  | "darkblessing"
  | "move_up"
  | "supershot"
  | "move_left"
  | "interact"
  | "phaseout"
  | "revive"
  | "stack"
  | "charge"
  | "partyheal"
  | "3shot"
  | "quickpunch"
  | "rspeed"
  | "taunt"
  | "stomp"
  | "stop"
  | "shadowstrike"
  | "pure_eval"
  | "cburst"
  | "hardshell"
  | "use_mp"
  | "burst"
  | "toggle_inventory"
  | "toggle_stats"
  | "agitate"
  | "poisonarrow"
  | "warcry"
  | "mcourage"
  | "use_hp"
  | "curse"
  | "toggle_character"
  | "travel"
  | "5shot"
  | "move_down"
  | "esc"
  | "toggle_run_code"
  | "attack"
  | "heal"
  | "track"
  | "absorb"
  | "toggle_code"
  | "open_snippet"
  | "throw"
  | "invis"
  | "cleave"
  | "energize"
  | "light"
  | "snippet"
  | "4fingers"
  | "quickstab"
  | "magiport"
  | "pcoat"
  | "scare";
*/