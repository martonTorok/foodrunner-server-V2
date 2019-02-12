const TYPES = {
  ItemService: Symbol.for("ItemService"),
  CartService: Symbol.for("CartService"),
  UserService: Symbol.for("UserService"),
  OrderService: Symbol.for("OrderService"),
  AuthenticationMiddleware: Symbol.for("AuthenticationMiddleware")
};

export default TYPES;
