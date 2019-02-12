import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey
} from "sequelize-typescript";

import Item from "./item.model";
import Order from "./order.model";

@Table({ tableName: "OrderItems" })
export default class OrderItem extends Model<OrderItem> {
  @Column(DataType.FLOAT)
  totalPrice: number;

  @Column(DataType.FLOAT)
  totalQuantity: number;

  @ForeignKey(() => Order)
  @Column
  orderId: number;

  @BelongsTo(() => Order)
  corder: Order;

  @ForeignKey(() => Item)
  @Column
  itemId: number;

  @BelongsTo(() => Item)
  item: Item;
}
