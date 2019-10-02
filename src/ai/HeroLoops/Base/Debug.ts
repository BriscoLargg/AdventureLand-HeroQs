export enum DebugLevel {
    Critical = 1 as number,
    Error = 2 as number,
    Warning = 4 as number,
    Information = 8 as number,
    Verbose = 16 as number
}

class Debug {

    DrawingEnabled: boolean = false;
    Enabled: boolean = false;
    Level: DebugLevel = DebugLevel.Critical;
 
    printAtDebugLevel(message: string, level: DebugLevel) {
        //if(level == DebugLevel.Information) console.log("Try to print debug at " + level + " and DebugLevel " + args.DebugLevel);
        if(this.Enabled && level <= this.Level) {
            console.log(message);
        }       
    };
    
    DebugCritical(message: string) {
        this.printAtDebugLevel(message, DebugLevel.Critical);
    }
    DebugError(message: string) {
        this.printAtDebugLevel(message, DebugLevel.Error );
    }
    DebugWarning(message: string) {
        this.printAtDebugLevel(message, DebugLevel.Warning );
    }
    
    DebugInfo(message: string) {
        this.printAtDebugLevel(message, DebugLevel.Information );
    }
    DebugVerbose(message: string) {
        this.printAtDebugLevel(message, DebugLevel.Verbose );
    }
    
    DebugCheck() {
        this.DebugVerbose("Debug Verbose Enabled");
        this.DebugInfo("Debug Info Enabled");
        this.DebugWarning("Debug Warning Enabled");
        this.DebugError("Debug Error Enabled");
        this.DebugCritical("Debug Critical Enabled");
    }

    Drawing() {
        //clear_drawings();
        return this.DrawingEnabled;
    }
}

export const D = new Debug();