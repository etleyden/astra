import { UserLogin, LoginResponse } from "@astra/shared";
import { getDB, User } from "@astra/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({path: "../.env"});

export class UserController {
  public greetUser(name: string): string {
    return `Hello, ${name}!`;
  }
  public async login(userLogin: UserLogin): Promise<LoginResponse> {
    const db = await getDB();
    return db.getRepository(User)
      .createQueryBuilder("user")
      .where("user.email = :email", {
        email: userLogin.email
      })
      .getMany()
      .then(async (users) => {
        // if there are none or more than one user returned, then 
        // the user doesn't exist or something is catastrophically wrong
        if(users.length !== 1) {
          return { error: "Invalid Credentials." }
        } else {
          // check the password
          const isValid = await bcrypt.compare(userLogin.password, users[0].passwordHash)
          if(!isValid) return { error: "Invalid Credentials." }
          // create the jwt token
          const token = jwt.sign({
            user_id: users[0].guid,
            user_email: users[0].email,
            user_fname: users[0].first_name
          }, process.env.JWT_SECRET, {expiresIn: "1d"});
          return {
            token: token,
            user: users[0]
          }
        }
      });
  }
}