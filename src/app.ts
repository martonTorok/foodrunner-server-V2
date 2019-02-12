import * as bodyParser from "body-parser";
import * as cors from "cors";
import { InversifyExpressServer } from "inversify-express-utils";
import { Sequelize } from "sequelize-typescript";
import { Container } from "inversify";

import TYPES from "./constant/types";
import ItemService from "./services/item.service";
import UserService from "./services/user.service";
import CartService from "./services/cart.service";
import OrderService from "./services/order.service";

class App {
  public server: InversifyExpressServer;
  public container: Container;

  constructor() {
    this.initContainer();
    this.server = new InversifyExpressServer(this.container);
    this.config();
    this.dbSetup();
  }

  private initContainer(): void {
    this.container = new Container();
    this.container.bind<ItemService>(TYPES.ItemService).to(ItemService);
    this.container.bind<UserService>(TYPES.UserService).to(UserService);
    this.container.bind<CartService>(TYPES.CartService).to(CartService);
    this.container.bind<OrderService>(TYPES.OrderService).to(OrderService);
  }

  private config(): void {
    this.server.setConfig(app => {
      app.use(bodyParser.json());
      app.use(cors());
    });
  }

  private async dbSetup() {
    const sequelize = new Sequelize({
      database: process.env.MYSQL_DATABASE,
      dialect: process.env.DB_DIALECT,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      modelPaths: [__dirname + "/models"]
    });
  }
}

export default App;
