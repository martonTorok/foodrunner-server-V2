import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { injectable } from "inversify";

import User from "../models/user.model";

@injectable()
class UserService {
  public async getUserById(id: number): Promise<User> {
    try {
      const user = await User.findById(id);
      return user;
    } catch (e) {
      throw Error("Error while getting user by id" + e);
    }
  }

  public async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await User.findOne({ where: { email } });
      return user;
    } catch (e) {
      throw Error("Error while getting user by email " + e);
    }
  }

  public async hashPassword(password: string): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      return hashedPassword;
    } catch (e) {
      throw Error("Error while hashing password");
    }
  }

  public async comparePassword(password: string, user: User): Promise<boolean> {
    try {
      const isValid = bcrypt.compare(password, user.password);
      return isValid;
    } catch (e) {
      throw Error("Error while bcrypt compare");
    }
  }

  public generateAuthToken(user: User) {
    return jwt
      .sign({ id: user.id, access: "auth" }, process.env.JWT_SECRET, {
        expiresIn: "12h"
      })
      .toString();
  }

  public async createUser(email: string, hashedPassword: string) {
    try {
      const user = await User.build({
        email,
        password: hashedPassword
      });
      await user.save();
      return user;
    } catch (e) {
      throw Error("Error while saving user");
    }
  }
}

export default UserService;
