export interface IArgs {
    TickCount: number;
}

export class BaseArgs implements IArgs {
    public TickCount: number = 1;
}
