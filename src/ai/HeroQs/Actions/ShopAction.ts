import { ItemInfo } from "definitions/game";
import { D } from "../Base/Debug";
import { RepeatingAction, RepeatingActionArgs } from "./RepeatingAction";
import { doesNotReject } from "assert";

export class RestockItem {
  constructor(item: ItemInfo, minimum: number, quantity: number, vendor: string) {
    this.Item = item;
    this.Minimum = minimum;
    this.RestockQuantity = quantity;
    this.Vendor = vendor;
  }

  Item: ItemInfo;
  Minimum: number;
  RestockQuantity: number;
  Vendor: string;
}

export class ShopActionArgs extends RepeatingActionArgs {
  Restock?: RestockItem[];

  Push(stock_item: RestockItem) {
    if(this.Restock && stock_item)
		this.Restock.push(stock_item);
  }
}

export class ShopAction extends RepeatingAction {
  constructor(args: ShopActionArgs) {
    super(args);
    this.Args = args;
    this.Action = this.MaintainAllStock;
    this.Name = "MaintainAllStock";
  }
  
  Args: ShopActionArgs;
  ResupplyInProgress: boolean = false;

  MaintainAllStock() {
    this.MaintainStock(this.Args);
  }
  
  MaintainStock(args: ShopActionArgs) {
    if(args.Restock && args.Restock.length > 0) {
      D.DebugInfo("Checking stock at " + this.Args.TickCount);
      for(var stock_item of args.Restock) {
        let quantity: number = this.GetQuantityFromInventory(stock_item.Item);
        D.DebugInfo("Buying " + stock_item.Item.name + " at or under # " + stock_item.Minimum + " until " + stock_item.RestockQuantity);
        if(quantity < stock_item.Minimum) {
          this.Resupply(args, stock_item);
        }
      }
    }
  }

  Resupply(args: ShopActionArgs, stock_item: RestockItem) {
    if(!args) return;
    if(this.ResupplyInProgress) return;
    this.ResupplyInProgress = true;
    
    smart_move({ to:stock_item.Vendor,return:true }, () => {
      if(args.Restock) for(var item of args.Restock) {
        if(item.Vendor == stock_item.Vendor) {
          this.RestockItem(item);
        }
      }
    });     
  }
  
  GetQuantityFromInventory(item: ItemInfo): number {
    let quantity: number = 0;
  
    let items_in_inventory: ItemInfo[] = this.SearchInventory((i) => i.name == item.name);
  
    items_in_inventory.forEach(item => {
      if(item.q) quantity += item.q;
    });
  
    return quantity;
  }
  
  SearchInventory(predicate: (p: any) => boolean): ItemInfo[] {
    let results: ItemInfo[] = [];
    
    character.items.forEach(i => {
      if(predicate != undefined) {
        if(i != undefined) {
          if(predicate(i)) {
            results.push(i);
          } 
        }
      }
    });
  
    return results;
  }
  
  RestockItem(stock_item: RestockItem) {
    let inventory = this.GetQuantityFromInventory(stock_item.Item);
    let total = stock_item.RestockQuantity - inventory;
    
    buy(stock_item.Item.name, total)
      .then((result: any) => {
        D.DebugInfo("Buying " + total + " " + stock_item.Item.name);
        set_message("Buying " + result.name);
        this.ResupplyInProgress = false;
      });
  }
}

