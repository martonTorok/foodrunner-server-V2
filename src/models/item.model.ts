import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "menuItems"
})
export default class Item extends Model<Item> {
  @Column(DataType.STRING)
  category: string;

  @Column(DataType.STRING)
  description: string;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.INTEGER)
  price: number;

  @Column(DataType.INTEGER)
  spicy: number;

  @Column(DataType.INTEGER)
  vegatarian: number;
}
