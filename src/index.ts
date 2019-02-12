import "reflect-metadata";

import "../config/config";
import "./controllers/item.controller";
import "./controllers/user.controller";
import "./controllers/cart.controller";
import "./controllers/order.controller";
import App from "./app";

const app = new App();
let serverInstance = app.server.build();
serverInstance.listen(process.env.PORT);
console.log(`Server started listening on port ${process.env.PORT}`);
