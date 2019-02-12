import { Request, Response } from "express";
import * as _ from "lodash";
import {
  controller,
  httpPost,
  request,
  response
} from "inversify-express-utils";
import { inject } from "inversify";

import TYPES from "../constant/types";
import CartService from "../services/cart.service";
import OrderService from "../services/order.service";
import authenticate from "../middleware/auth.middleware";

@controller("/order", authenticate)
export class OrderController {
  constructor(
    @inject(TYPES.OrderService) private orderService: OrderService,
    @inject(TYPES.CartService) private cartService: CartService
  ) {}

  @httpPost("/create")
  public async createOrder(
    @request() request: Request,
    @response() response: Response
  ) {
    const userId = request["user"].id;
    const body = _.pick(request.body, ["address", "fullname", "phonenumber"]);
    if (!body) {
      response.status(400).send({ error: "Missing user data!" });
    }
    try {
      const cart = await this.cartService.getCart(userId);
      const cartItems = await this.cartService.getCartItems(cart);
      const order = await this.orderService.createOrder(
        userId,
        body.address,
        body.fullname,
        body.phonenumber
      );
      const orderItems = await this.orderService.createOrderItems(
        order,
        cartItems
      );
      response.status(200).send(order);
    } catch (e) {
      response.status(500).send(e);
    }
  }
}
