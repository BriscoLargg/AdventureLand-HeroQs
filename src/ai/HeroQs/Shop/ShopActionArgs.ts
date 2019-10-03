import { RepeatingActionArgs } from "../Actions/RepeatingActionArgs";
import { RestockItem } from "./RestockItem";

export class ShopActionArgs extends RepeatingActionArgs {
    public Restock?: RestockItem[];

    public Push(stockItem: RestockItem) {
      if(this.Restock && stockItem) {
        this.Restock.push(stockItem);
      }
    }
}
