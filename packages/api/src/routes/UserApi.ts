import { Post, Param, Controller } from "routing-controllers";
import { UserController } from "controllers";

@Controller()
export class UserApi {
  private userController = new UserController();
  @Post("/greet/:name")
  greet(@Param("name") name: string) {
    return this.userController.greetUser(name);
  }
}
