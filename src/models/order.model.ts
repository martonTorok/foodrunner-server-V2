import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey
} from "sequelize-typescript";

import User from "./user.model";

@Table({ tableName: "Orders" })
export default class Order extends Model<Order> {
  @Column(DataType.STRING)
  address: string;

  @Column(DataType.STRING)
  fullname: string;

  @Column(DataType.STRING)
  phoneNumber: string;

  @ForeignKey(() => User)
  @Column
  userId: number;
}
