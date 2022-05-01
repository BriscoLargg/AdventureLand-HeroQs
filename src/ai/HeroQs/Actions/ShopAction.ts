import { D } from "../Base/Debug";

import { RepeatingAction } from "./RepeatingAction";

import { IItem } from "GameDefinitions/IItem";
import { RestockItem } from "./RestockItem";
import { gameEvents } from "../Base/Event";

export interface IShopArgs {
    Restock?: RestockItem[];
}

export class ShopAction extends RepeatingAction {
  constructor(args: IShopArgs) {
    super();
    this.Action = this.MaintainStock;
    this.DelayInMS = 30000;
    this.Name = "MaintainStock";

    this.Restock = args.Restock;
  }

  public Restock?: RestockItem[];
  public ResupplyInProgress: boolean = false;

  public Push(stockItem: RestockItem) {
    if (this.Restock && stockItem) {
      this.Restock.push(stockItem);
    }
  }

  public MaintainStock() {
    if (this.Restock && this.Restock.length > 0) {
      D.DebugInfo("Checking stock at " + this.TickCount);
      for (const stockItem of this.Restock) {
        const quantity: number = this.GetQuantityFromInventory(stockItem.Item);
        D.DebugInfo("Buying " +
                    stockItem.Item.name +
                    " at or under # " +
                    stockItem.Minimum +
                    " until " + stockItem.RestockQuantity);
        if (quantity < stockItem.Minimum) {
          this.Resupply(stockItem);
        }
      }
    }
  }

  public Resupply(stockItem: RestockItem) {
    if (this.ResupplyInProgress) { return; }
    this.ResupplyInProgress = true;

    gameEvents.emit("ResupplyInProgress");

    smart_move({ "to": stockItem.Vendor, "return": true }, () => {
      if (this.Restock) {
        for (const item of this.Restock) {
          if (item.Vendor === stockItem.Vendor) {
            this.RestockItem(item);
          }
        }
      }

      gameEvents.emit("ResupplyEnded");
    });
  }

  public GetQuantityFromInventory(item: IItem): number {
    let quantity: number = 0;
    if (!item) { return quantity; }

    const itemsInInventory: IItem[] = this.SearchInventory((i) => {
        if (!i) { return false ; }
        return (i.name === item.name);
    });

    itemsInInventory.forEach((i) => {
      if (i.q) {
        quantity += i.q;
      }
    });

    return quantity;
  }

  public SearchInventory(predicate: (p: any) => boolean): IItem[] {
    const results: IItem[] = [];

    character.items.forEach((i: any) => {
        if (predicate !== undefined) {
            if (i !== undefined) {
                if (predicate(i)) {
                    results.push(i);
                }
            }
        }
    });

    return results;
  }

  public RestockItem(stockItem: RestockItem) {
    const inventory = this.GetQuantityFromInventory(stockItem.Item);
    const total = stockItem.RestockQuantity - inventory;

    buy(stockItem.Item.name, total)
      .then((result: any) => {
        D.DebugInfo("Buying " + total + " " + stockItem.Item.name);
        set_message("Buying " + result.name);
        this.ResupplyInProgress = false;
      });
  }
}
