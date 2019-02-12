import { injectable } from "inversify";

import Order from "../models/order.model";
import CartItem from "../models/item-cart.model";
import OrderItem from "../models/item-order.model";

@injectable()
class OrderService {
  public async createOrder(
    userId: number,
    address: string,
    fullname: string,
    phoneNumber: string
  ): Promise<Order> {
    const order = new Order({
      address,
      fullname,
      phoneNumber,
      userId
    });
    await order.save();
    return order;
  }

  public async createOrderItems(
    order: Order,
    cartItems: CartItem[]
  ): Promise<OrderItem[]> {
    const orderItems = [];
    for (let item of cartItems) {
      let orderItem = new OrderItem({
        totalPrice: item.totalPrice,
        totalQuantity: item.totalQuantity,
        orderId: order.id,
        itemId: item.itemId
      });
      await orderItem.save();
      orderItems.push(orderItem);
    }
    return orderItems;
  }
}

export default OrderService;
