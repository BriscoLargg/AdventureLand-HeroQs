export interface IArgs {
    TickCount: number;   
}

export class BaseArgs implements IArgs {
    TickCount: number = 1;

    ToString() {
        let result = "";
        for (var key in this) {
            result += this[key] + " \n";
        }

        return result;
    }
}





