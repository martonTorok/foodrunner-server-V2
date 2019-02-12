import { Response, Request } from "express";
import * as _ from "lodash";
import {
  controller,
  httpPost,
  request,
  response
} from "inversify-express-utils";
import { inject } from "inversify";

import UserService from "../services/user.service";
import CartService from "../services/cart.service";
import TYPES from "../constant/types";

@controller("/users")
export class UserController {
  constructor(
    @inject(TYPES.UserService) private userService: UserService,
    @inject(TYPES.CartService) private cartService: CartService
  ) {}

  @httpPost("/create")
  public async addNewUser(
    @request() request: Request,
    @response() response: Response
  ) {
    try {
      let credentials = _.pick(request.body, ["email", "password"]);
      if (credentials.password.length < 6) {
        return response
          .status(400)
          .send({ error: "Password must be minimum 6 characters long!" });
      }
      if (await this.userService.getUserByEmail(credentials.email)) {
        response.status(400).send({
          error: `User with email: ${credentials.email} already registered!`
        });
      } else {
        credentials.password = await this.userService.hashPassword(
          credentials.password
        );
        const user = await this.userService.createUser(
          credentials.email,
          credentials.password
        );
        const cart = await this.cartService.createCart(user);
        user.password = undefined;
        response.send(user);
      }
    } catch (e) {
      response.status(400).send({ error: "Invalid input" });
    }
  }

  @httpPost("/login")
  public async login(
    @request() request: Request,
    @response() response: Response
  ) {
    const credentials = request.body;
    const user = await this.userService.getUserByEmail(credentials.email);
    if (user) {
      const isPasswordMatching = await this.userService.comparePassword(
        credentials.password,
        user
      );
      if (isPasswordMatching) {
        const token = this.userService.generateAuthToken(user);
        response.header("x-auth", token);
        response.send({ token });
      } else {
        response.status(401).send({ error: "Wrong credentials!" });
      }
    } else {
      response.status(401).send({ error: "Wrong credentials!" });
    }
  }
}
