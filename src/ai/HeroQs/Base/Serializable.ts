import { fromJSON } from "tough-cookie";
import { D } from "./Debug";

export class Serializable {
    constructor(json: string) {
        fromJSON(json);
    }

    public static fromJSON(json: any) {
        //const jsonObj: any = JSON.parse(json);
        //D.DebugCritical(jsonObj);
        Object.assign(this, json);
        D.DebugCritical(json);
    }
}
