import { injectable } from "inversify";

import Item from "../models/item.model";

@injectable()
class ItemService {
  public async getAllItems(): Promise<Item[]> {
    try {
      const items = await Item.findAll();
      return items;
    } catch (e) {
      throw Error("Error while getting all items " + e);
    }
  }

  public async getItemById(id: number): Promise<Item> {
    try {
      const item = await Item.findById(id);
      return item;
    } catch (e) {
      throw Error("Error while getting item " + e);
    }
  }

  public async getItemsByCategory(category: string): Promise<Item[]> {
    try {
      const items = await Item.findAll({ where: { category } });
      return items;
    } catch (e) {
      throw Error("Error while getting items by category " + e);
    }
  }
}

export default ItemService;
