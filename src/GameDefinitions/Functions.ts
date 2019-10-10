import { IEntity } from "GameDefinitions/IEntity";
import { ICharacter } from "./ICharacter";
import { IDrawing } from "./IDrawing";

// type ItemName = string; // TODO: Same as with skills

// export type EntityId = string;
declare global {
  interface Window {
    clear_game_logs(): void;
    party_list: string[];
    party: { [name: string]: ICharacter };
    entities: { [id: string]: IEntity };
    next_skill: { [id: string]: Date };
    start_runner(): void;
    stop_runner(): void;
  }

  var $: any;
  var character: ICharacter;
  var game_logs: any[];

  var clear_game_logs: () => void;
  var handle_death: () => void;

  function accept_party_invite(from: string): void;
  function attack(entity: IEntity): void;
  function buy(name: string, quantity?: number): Promise<object>;
  function buy_with_gold(item: string, q: number): void;
  function can_attack(entity: IEntity): boolean;
  function can_move(args: { map: string; x: number; y: number; going_x: number; going_y: number }): boolean;
  function can_move_to(x: number, y: number): boolean;
  function can_use(skill: string): boolean;
  function change_target(target: IEntity, send?: boolean): void;
  function clear_drawings(): void;
  function distance(entity1: IEntity, entity2: IEntity): number;
  function game_log(msg: string, color?: string): void;
  function get_nearest_hostile(args: object): IEntity;
  function get_nearest_monster(args: object): IEntity;
  function get_player(name: string): IEntity | undefined;
  function get_target(): IEntity | undefined;
  function get_target_of(entity: IEntity): IEntity | undefined;
  function get_targeted_monster(): IEntity;
  function heal(entity: IEntity): void;
  function in_attack_range(target: IEntity): boolean;
  function is_monster(entity: IEntity): boolean;
  function is_moving(entity: IEntity): boolean;
  function load_code(foo: string): void;
  function loot(): void;
  function map_key(key: string, thing: string, arg?: string): void;
  function move(x: number, y: number): void;
  function request_party_invite(to: string): void;
  function respawn(): void;
  function send_cm(to: string, data: any): void;
  function send_party_invite(to: string): void;
  function set_message(msg: string): void;
  function set_skillbar(arguments: string[]): void;
  function show_json(stuff: any): void;
  function smart_move(destination: IEntity | any | string, on_done?: any): void;
  function start_character(name: string, script: string): void;
  function stop(what: string): void;
  function stop_character(name: string, script: string): void;
  function unmap_key(key: string): void;
  function upgrade(itemPos: number, scrollPos: number, offeringPos?: number): void;
  function use(skill: string, target?: IEntity): void;
  function use_hp_or_mp(): void;
  function use_skill(skill: string, target?: IEntity): void;
  function xmove(x: number, y: number): void;

  function draw_circle(x: number, y: number, radius: number, size?: number, color?: number): IDrawing;
  function draw_line(x: number, y: number, x2: number, y2: number, size?: number, color?: number): IDrawing;

  var handle_command: undefined | ((command: string, args: string) => void);
  var on_cm: undefined | ((from: string, data: any) => void);
  // var on_map_click: undefined | ((x: number, y: number) => boolean);
  var on_party_invite: undefined | ((from: string) => void);
  var on_party_request: undefined | ((from: string) => void);
}