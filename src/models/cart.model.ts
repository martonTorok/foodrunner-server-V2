import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey
} from "sequelize-typescript";

import User from "./user.model";

@Table({ tableName: "shoppingCarts" })
export default class Cart extends Model<Cart> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
