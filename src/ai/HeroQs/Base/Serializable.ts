export class Serializable {
    public static fromJSON(json: any) {
        const jsonObj: any = JSON.parse(json);
        Object.assign(this, jsonObj);
    }
}
