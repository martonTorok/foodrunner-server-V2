import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

import User from "../models/user.model";

async function authenticate(
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (request.get("x-auth")) {
    try {
      const decoded = jwt.verify(request.get("x-auth"), process.env.JWT_SECRET);
      const id = decoded["id"];
      const expireIn = decoded["exp"];
      const currentTime = Math.round(new Date().getTime() / 1000);
      const user = await User.findByPk(id);
      if (user && expireIn > currentTime) {
        request["user"] = user;
        next();
      } else {
        response.status(401).send({ error: "Wrong authentication token!" });
      }
    } catch (e) {
      response.status(401).send({ error: "Wrong authentication token!" });
    }
  } else {
    response.status(401).send({ error: "Authentication token missing!" });
  }
}

export default authenticate;
