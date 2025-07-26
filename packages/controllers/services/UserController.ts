import { User, UserLogin, LoginResponse, UserRegistration } from "@astra/shared";
import { getDB, User as UserEntity } from "@astra/db";
import { Transformers } from "../transformers";
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
    return db.getRepository(UserEntity)
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
          const isValid = await bcrypt.compare(userLogin.password, users[0].hashedPassword)
          if(!isValid) return { error: "Invalid Credentials." }
          // create the jwt token
          const token = jwt.sign({
            user_id: users[0].guid,
            user_email: users[0].email,
            user_fname: users[0].first_name
          }, process.env.JWT_SECRET, {expiresIn: "1d"});
          return {
            token: token,
            user: Transformers.User(users[0]) as User
          }
        }
      });
  }
  public async register(userRegistration: UserRegistration): Promise<LoginResponse | undefined> {
    const db = await getDB();
    // salt of 10 is arbitrary. may need adjustment
    const hashedPassword = await bcrypt.hash(userRegistration.password, 10); 
    // Attempt to create the user in the DB
    db.createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values({
        email: userRegistration.email,
        hashedPassword: hashedPassword,
        first_name: userRegistration.first_name,
        last_name: userRegistration.last_name
      })
      .execute()
      .catch((err) => {
        // TODO: add some more specific responses for common scenarios, 
        // and obscure oddball errors to end user. For now it's 
        // transparent for development
        console.error("User Registration Error (27818986-8a9b-4652-baae-6e2428810513)")
        return { error: `If you're a user, you shouldn't be seeing this: ${JSON.stringify(err)}` }
      });
    // Get a login token for the new user
    return await this.login(userRegistration);
  }
}