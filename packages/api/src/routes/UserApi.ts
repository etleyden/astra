import { Post, Param, Controller, Body } from "routing-controllers";
import { UserController } from "@astra/controllers";

@Controller()
export class UserApi {
  private userController = new UserController();
  @Post("/greet/:name")
  greet(@Param("name") name: string) {
    return this.userController.greetUser(name);
  }
  @Post("/login")
  login() {

  }
}
