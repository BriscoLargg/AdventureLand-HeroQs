import { IItem } from "GameDefinitions/game";

export class RestockItem {
    constructor(item: IItem, minimum: number, quantity: number, vendor: string) {
      this.Item = item;
      this.Minimum = minimum;
      this.RestockQuantity = quantity;
      this.Vendor = vendor;
    }

    public Item: IItem;
    public Minimum: number;
    public RestockQuantity: number;
    public Vendor: string;
  }
