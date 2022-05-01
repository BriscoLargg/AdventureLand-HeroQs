export enum DebugLevel {
    Critical = 1 as number,
    Error = 2 as number,
    Warning = 4 as number,
    Information = 8 as number,
    Verbose = 16 as number
}

class Debug {

    public CodeCost: boolean = false;
    public DrawingEnabled: boolean = false;
    public Enabled: boolean = false;
    public Level: DebugLevel = DebugLevel.Critical;

    public printAtDebugLevel(message: string, level: DebugLevel) {
        // D.DebugInfo("Try to print debug at " + level + " and DebugLevel " + args.DebugLevel);
        if ((this.Enabled && level <= this.Level) || level === DebugLevel.Critical) {
            console.log(message);
        }
    }

    public DebugCritical(message: string) {
        this.printAtDebugLevel(message, DebugLevel.Critical);
    }
    public DebugError(message: string) {
        this.printAtDebugLevel(message, DebugLevel.Error );
    }
    public DebugWarning(message: string) {
        this.printAtDebugLevel(message, DebugLevel.Warning );
    }
    public DebugInfo(message: string) {
        this.printAtDebugLevel(message, DebugLevel.Information );
    }
    public DebugVerbose(message: string) {
        this.printAtDebugLevel(message, DebugLevel.Verbose );
    }

    public DebugCheck() {
        this.DebugVerbose("Debug Verbose Enabled");
        this.DebugInfo("Debug Info Enabled");
        this.DebugWarning("Debug Warning Enabled");
        this.DebugError("Debug Error Enabled");
        this.DebugCritical("Debug Critical Enabled");
    }

    public Drawing() {
        // clear_drawings();
        return this.DrawingEnabled;
    }

    public CC(message: string) {
        if (this.CodeCost) {
            this.DebugCritical(message);
        }
    }
}

export const D = new Debug();
