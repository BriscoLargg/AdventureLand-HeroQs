import { Serializable } from "../HeroQs/Base/Serializable";

export interface ISkill {
  mp?: number;
  name: string;
  cooldown: number;
  ratio?: number;
  range?: number;
}

class Skill extends Serializable implements ISkill  {
    constructor(skillname: SkillName, cooldown: number) {
        super();
        this.name = skillname;
        this.cooldown = cooldown;
    }

    public name: SkillName;
    public cooldown: number;
    public mp?: number;
    public ratio?: number;
    public ranger?: number;
}

export enum SkillName {
  _3shot = "3shot",
  _4fingers = "4fingers",
  _5shot = "5shot",
  absorb = "absorb",
  agitate = "agitate",
  attack = "attack",
  blink = "blink",
  burst = "burst",
  cburst = "cburst",
  charge = "charge",
  cleave = "cleave",
  curse = "curse",
  darkblessing = "darkblessing",
  energize = "energize",
  esc = "esc",
  gm = "gm",
  hardshell = "hardshell",
  heal = "heal",
  huntersmark = "huntersmark",
  interact = "interact",
  invis = "invis",
  light = "light",
  magiport = "magiport",
  mcourage = "mcourage",
  mluck = "mluck",
  move_down = "move_down",
  move_left = "move_left",
  move_right = "move_right",
  move_up = "move_up",
  open_snippet = "open_snippet",
  partyheal = "partyheal",
  pcoat = "pcoat",
  phaseout = "phaseout",
  poisonarrow =  "poisonarrow",
  pure_eval = "pure_eval",
  quickpunch = "quickpunch",
  quickstab = "quickstab",
  revive = "revive",
  rspeed = "rspeed",
  scare = "scare",
  shadowstrike = "shadowstrike",
  snippet = "snippet",
  stack = "stack",
  stomp = "stomp",
  stop = "stop",
  supershot = "supershot",
  taunt = "taunt",
  throw = "throw",
  toggle_character = "toggle_character",
  toggle_code = "toggle_code",
  toggle_inventory = "toggle_inventory",
  toggle_run_code = "toggle_run_code",
  toggle_stats = "toggle_stats",
  track =  "track",
  travel = "travel",
  use_hp = "use_hp",
  use_mp = "use_mp",
  use_town = "use_town",
  warcry = "warcry",
}
