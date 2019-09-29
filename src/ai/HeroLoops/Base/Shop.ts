import { ItemInfo } from "definitions/game";

const HP_SMALL: ItemInfo = {name: 'hpot0'};

export function replenish_potions() {
  maintain_stock(HP_SMALL, 15, 100, "potions");
}

export function maintain_all_stock() {
  
}

export function maintain_stock(stock_item: ItemInfo, restock_minimum: number, restock_quantity: number, vendor: string) {
  let quantity: number = quantity_inventory(stock_item);

  //console.log("Buying " + stock_item.name + " at or under # " + restock_minimum + " until " + restock_quantity);
  if(quantity < restock_minimum) {
    smart_move(vendor, () => buy_item(stock_item, restock_quantity));
  }
}

function quantity_inventory(item: ItemInfo): number {
  let quantity: number = 0;

  let items_in_inventory: ItemInfo[] = search_inventory((i) => i.name == item.name);

  items_in_inventory.forEach(item => {
    if(item.q) quantity += item.q;
  });

  return quantity;
}

function search_inventory(predicate: (p: any) => boolean): ItemInfo[] {
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

export function buy_item(item: ItemInfo, quantity: number) {
  console.log("Buying " + quantity + " " + item.name)
  buy(item.name, quantity);
  set_message("Buying " + item.name);
}