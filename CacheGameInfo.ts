import http from "http";

import { IEntity } from "GameDefinitions/IEntity";
import { IGameInfo } from "GameDefinitions/IGameInfo";
import { IItem, ItemName } from "GameDefinitions/IItem";
import { IMonster } from "GameDefinitions/IMonster";
import { ISkill, SkillName } from "GameDefinitions/ISkill";
import { Serializable } from "./src/ai/HeroQs/Base/Serializable";

export class GameInfo extends Serializable implements IGameInfo {
    private constructor() {
        super();

        GameInfo.init();

        setTimeout(() => {
            GameInfo.buffer.substring(6, GameInfo.buffer.length - 2);
            const json: IGameInfo = JSON.parse(GameInfo.buffer);
            GameInfo.instance = json;
            GameInfo.loaded = true;

            console.log(GameInfo.buffer);
        }, 5000);
    }

    private static instance: GameInfo;
    private static loaded: boolean = false;
    private static buffer: string = "";

    public items!: { [T in ItemName]: IItem };
    public monsters: { [id: string]: IMonster } = {};
    public npcs: { [id: string]: IEntity } = {};
    public skills!: { [T in SkillName]: ISkill };
    public version: number = 1;

    // public Print() {
    //     for(const key in this) {
    //         if(key) {
    //             console.log("Key is " + key);
    //         }
    //     }
    // }

    public static get(): GameInfo {
        if (!GameInfo.instance) {
            GameInfo.init();
        }

        return GameInfo.instance;
    }

    private static init() {
        if (!GameInfo.loaded) {
            const options = {
                "hostname": "adventure.land",
                "path": "/data.js",
                "port": 80
                //
            };

            const result = http.get(options, (res) => {
                res.on("data", (d) => {
                    GameInfo.buffer += d;

                });
                res.on("error", (e) => {
                    console.error(e);
                });
            });
        }
    }
}

export const G: GameInfo = GameInfo.get();

//console.log(G);
