import { injectable } from "inversify";

import User from "../models/user.model";
import Cart from "../models/cart.model";
import CartItem from "../models/item-cart.model";
import Item from "../models/item.model";

@injectable()
class CartService {
  public async getCart(userId: number): Promise<Cart> {
    try {
      const cart = await Cart.findOne({ where: { userId: userId } });
      return cart;
    } catch (e) {
      throw Error("Error while getting cart " + e);
    }
  }

  public async createCart(user: User): Promise<Cart> {
    try {
      const cart = await Cart.build({
        userId: user.id
      });
      await cart.save();
      return cart;
    } catch (e) {
      throw Error("Error while creating Cart");
    }
  }

  public getCartTotalPrice(cartItems: CartItem[]): number {
    let totalPrice = 0;
    cartItems.forEach(item => {
      totalPrice += item.totalPrice;
    });
    return totalPrice;
  }

  public getCartNrOfItems(cartItems: CartItem[]): number {
    let totalQuantity = 0;
    cartItems.forEach(item => {
      totalQuantity += item.totalQuantity;
    });
    return totalQuantity;
  }

  public async getCartItem(item: Item, cart: Cart): Promise<CartItem> {
    try {
      const cartItem = await CartItem.findOne({
        where: {
          cartId: cart.id,
          itemId: item.id
        }
      });
      return cartItem;
    } catch (e) {
      throw Error("Error while getting cart item " + e);
    }
  }

  public async getCartItems(cart: Cart): Promise<CartItem[]> {
    try {
      const cartItems = await CartItem.findAll({
        where: {
          cartId: cart.id
        },
        include: [
          {
            model: Item,
            as: "item"
          }
        ]
      });
      return cartItems;
    } catch (e) {
      throw Error("Error while getting cart items " + e);
    }
  }

  public async createCartItem(item: Item, cart: Cart): Promise<CartItem> {
    try {
      return await CartItem.build({
        cartId: cart.id,
        itemId: item.id,
        totalPrice: item.price,
        totalQuantity: 1
      }).save();
    } catch (e) {
      throw Error("Error while saving cart item " + e);
    }
  }

  public async increaseCartItemQuantity(
    cartItem: CartItem,
    item: Item
  ): Promise<CartItem> {
    try {
      return await cartItem.update({
        totalQuantity: cartItem.totalQuantity + 1,
        totalPrice: item.price * (cartItem.totalQuantity + 1)
      });
    } catch (e) {
      throw Error("Error while updating cart item " + e);
    }
  }

  public async decreaseCartItemQuantity(
    cartItem: CartItem,
    item: Item
  ): Promise<CartItem | number> {
    try {
      if (cartItem.totalQuantity === 1) {
        return await CartItem.destroy({ where: { id: cartItem.id } });
      }
      return await cartItem.update({
        totalQuantity: cartItem.totalQuantity - 1,
        totalPrice: item.price * (cartItem.totalQuantity - 1)
      });
    } catch (e) {
      throw Error("Error while updating cart item " + e);
    }
  }

  public async destroyCartItem(cart: Cart): Promise<number> {
    try {
      return await CartItem.destroy({ where: { cartId: cart.id } });
    } catch (e) {
      throw Error("Error while destroying car item " + e);
    }
  }
}

export default CartService;
