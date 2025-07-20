import { UserLogin } from "@astra/shared";
export class UserController {
  public greetUser(name: string): string {
    return `Hello, ${name}!`;
  }
  public login(userLogin: UserLogin) {

  }
}