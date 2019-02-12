import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey
} from "sequelize-typescript";

import Cart from "./cart.model";
import Item from "./item.model";

@Table({ tableName: "shoppingCartItems" })
export default class CartItem extends Model<CartItem> {
  @Column(DataType.FLOAT)
  totalPrice: number;

  @Column(DataType.FLOAT)
  totalQuantity: number;

  @ForeignKey(() => Cart)
  @Column
  cartId: number;

  @BelongsTo(() => Cart)
  cart: Cart;

  @ForeignKey(() => Item)
  @Column
  itemId: number;

  @BelongsTo(() => Item)
  item: Item;
}
