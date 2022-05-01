import { EventEmitter } from "events";
import StrictEventEmitter from "strict-event-emitter-types";

// define your events
export interface IEvent {
  request: (request: Request, response: Response) => void;
  done: void;
}

export const gameEvents: EventEmitter = new EventEmitter();
