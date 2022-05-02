import { Serializable } from "./Serializable";
import { ISkill } from "GameDefinitions/ISkill";
import { D } from "./Debug";

import G_skills from "GameDefinitions/G/skills.json";

export class Skill implements ISkill {
    constructor(name: string) {
        const returnedObject = Object.assign(this, (G_skills as any)[name]);
        if (returnedObject.name) {
            returnedObject.name = returnedObject.name.toLowerCase().replace(/('| |!)/g, "");
        }

        return returnedObject;
    }

    public mp?: number;
    public cooldown!: number;
    public ratio?: number;
    public range?: number;
    public name!: string;
}
