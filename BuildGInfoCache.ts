import download from "download";
import fs from "fs";
import { IGameInfo } from "GameDefinitions/IGameInfo";

export class GameInfo implements IGameInfo {
    constructor() {
        this.init();
    }

    public geometry: any;
    public items: any;
    public monsters: any;
    public npcs: any;
    public skills: any;
    public version: any;

    private printFile(json: JSON) {
        for (const [key, value] of Object.entries(json)) {

            const stringified = JSON.stringify(value);
            // stringified = stringified.replace(/^/, "export const G." + key + " = ")
            fs.writeFileSync("./src/GameDefinitions/G/" + key + ".json", stringified, { "flag": "w+" });
        }
    }

    private init() {
        fs.readFile("./data.js", { "encoding": "utf8" }, (err, data) => {
            if (err) { console.log(err); }

            if (data) {
                const json = JSON.parse(data.replace(/var G=/, "").replace(/;/, ""));

                this.printFile(json);

                this.geometry = json.geometry;
                // this.items = json.items;
                // this.monsters = json.monsters;
                // this.npcs = json.npcs;
                // this.skills = json.skills;
                // this.version = json.version;
            }
        });
    }

    private refreshCache() {
        download("http://adventure.land/data.js", "./").then((data) => {
        // no op
    });
    }
}

export const G = new GameInfo();
