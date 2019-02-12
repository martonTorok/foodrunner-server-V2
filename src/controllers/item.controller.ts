import { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  response,
  request,
  requestParam,
  queryParam
} from "inversify-express-utils";

import ItemService from "../services/item.service";
import TYPES from "../constant/types";

@controller("/items")
export class ItemController {
  constructor(@inject(TYPES.ItemService) private itemService: ItemService) {}

  @httpGet("/")
  public async getItemsByCategory(
    @request() request: Request,
    @response() response: Response,
    @queryParam("category") category: string
  ) {
    try {
      const items = await this.itemService.getItemsByCategory(category);
      response.status(200).send(items);
    } catch (e) {
      response.status(400).send(e);
    }
  }

  @httpGet("/:id")
  public async getItemById(
    @request() request: Request,
    @response() response: Response,
    @requestParam("id") id: number
  ) {
    try {
      const item = await this.itemService.getItemById(id);
      response.status(200).send(item);
    } catch (e) {
      response.status(400).send(e);
    }
  }
}
