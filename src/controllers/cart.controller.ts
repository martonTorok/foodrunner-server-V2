import { Request, Response } from "express";
import {
  controller,
  httpGet,
  httpPost,
  httpDelete,
  request,
  response,
  requestParam
} from "inversify-express-utils";
import { inject } from "inversify";

import TYPES from "../constant/types";
import CartService from "../services/cart.service";
import ItemService from "../services/item.service";
import authenticate from "../middleware/auth.middleware";

@controller("/cart", authenticate)
export class CartController {
  constructor(
    @inject(TYPES.ItemService) private itemService: ItemService,
    @inject(TYPES.CartService) private cartService: CartService
  ) {}

  @httpGet("/")
  public async getCartItems(
    @request() request: Request,
    @response() response: Response
  ) {
    const userId = request["user"].id;
    try {
      const cart = await this.cartService.getCart(userId);
      const cartItems = await this.cartService.getCartItems(cart);
      const totalPrice = this.cartService.getCartTotalPrice(cartItems);
      const totalQuantity = this.cartService.getCartNrOfItems(cartItems);
      response.status(200).send({ totalPrice, totalQuantity, cartItems });
    } catch (e) {
      response.status(500).send(e);
    }
  }

  @httpPost("/add/:id")
  public async addItemToCart(
    @request() request: Request,
    @response() response: Response,
    @requestParam("id") itemId: number
  ) {
    const userId = request["user"].id;
    try {
      const item = await this.itemService.getItemById(itemId);
      const cart = await this.cartService.getCart(userId);
      let cartItems = await this.cartService.getCartItems(cart);
      let totalPrice = await this.cartService.getCartTotalPrice(cartItems);
      //Intentional bug for homework
      if (cartItems.length > 1 && totalPrice + item.price > 10000) {
        response
          .status(500)
          .send({ error: "Homework Bug condition fulfilled!" });
        throw new Error("Homework Bug condition fulfilled!");
      }
      //----------------------------
      if (totalPrice + item.price > +process.env.CART_UPPER_BOUND) {
        return response
          .status(400)
          .send({ error: "Cart total price exceeded the limit." });
      }
      const cartItem = await this.cartService.getCartItem(item, cart);
      if (cartItem === null) {
        await this.cartService.createCartItem(item, cart);
      } else {
        await this.cartService.increaseCartItemQuantity(cartItem, item);
      }
      cartItems = await this.cartService.getCartItems(cart);
      totalPrice = this.cartService.getCartTotalPrice(cartItems);
      const totalQuantity = this.cartService.getCartNrOfItems(cartItems);
      response.status(200).send({ totalPrice, totalQuantity, cartItems });
    } catch (e) {
      response.status(500).send(e);
    }
  }

  @httpPost("/remove/:id")
  public async removeFromCart(
    @request() request: Request,
    @response() response: Response,
    @requestParam("id") itemId: number
  ) {
    const userId = request["user"].id;
    try {
      const item = await this.itemService.getItemById(itemId);
      const cart = await this.cartService.getCart(userId);
      const cartItem = await this.cartService.getCartItem(item, cart);
      if (cartItem === null) {
        response.status(400).send({ error: `No item: ${itemId} in cart!` });
      } else {
        await this.cartService.decreaseCartItemQuantity(cartItem, item);
      }
      const cartItems = await this.cartService.getCartItems(cart);
      const totalPrice = this.cartService.getCartTotalPrice(cartItems);
      const totalQuantity = this.cartService.getCartNrOfItems(cartItems);
      response.status(200).send({ totalPrice, totalQuantity, cartItems });
    } catch (e) {
      response.status(500).send(e);
    }
  }

  @httpDelete("/empty")
  public async emptyCart(request: Request, response: Response) {
    const userId = request["user"].id;
    try {
      const cart = await this.cartService.getCart(userId);
      await this.cartService.destroyCartItem(cart);
      const cartItems = await this.cartService.getCartItems(cart);
      response.status(200).send(cartItems);
    } catch (e) {
      response.status(500).send(e);
    }
  }
}
