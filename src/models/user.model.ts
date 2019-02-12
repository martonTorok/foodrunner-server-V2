import { Table, Column, Model, HasMany, IsEmail } from "sequelize-typescript";

import Order from "./order.model";

@Table({ tableName: "Users" })
export default class User extends Model<User> {
  @IsEmail
  @Column
  email: string;

  @Column
  password: string;

  @HasMany(() => Order)
  orders: Order[];
}
