import { D } from "../Base/Debug";

import { RepeatingAction } from "../Actions/RepeatingAction";
import { ShopActionArgs } from "./ShopActionArgs";

import { IItem } from "GameDefinitions/IItem";
import { RestockItem } from "./RestockItem";

export class ShopAction extends RepeatingAction {
  constructor(args: ShopActionArgs) {
    super(args);
    this.Args = args;
    this.Action = this.MaintainAllStock;
    this.Name = "MaintainAllStock";
  }

  public Args: ShopActionArgs;
  public ResupplyInProgress: boolean = false;

  public MaintainAllStock() {
    this.MaintainStock(this.Args);
  }

  public MaintainStock(args: ShopActionArgs) {
    if (args.Restock && args.Restock.length > 0) {
      D.DebugInfo("Checking stock at " + this.Args.TickCount);
      for (const stockItem of args.Restock) {
        const quantity: number = this.GetQuantityFromInventory(stockItem.Item);
        D.DebugInfo("Buying " +
                    stockItem.Item.name +
                    " at or under # " +
                    stockItem.Minimum +
                    " until " + stockItem.RestockQuantity);
        if (quantity < stockItem.Minimum) {
          this.Resupply(args, stockItem);
        }
      }
    }
  }

  public Resupply(args: ShopActionArgs, stockItem: RestockItem) {
    if (!args) { return; }
    if (this.ResupplyInProgress) { return; }
    this.ResupplyInProgress = true;

    smart_move({ "to": stockItem.Vendor, "return": true }, () => {
      if (args.Restock) {
        for (const item of args.Restock) {
          if (item.Vendor === stockItem.Vendor) {
            this.RestockItem(item);
          }
        }
      }
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
