import { Post, Param, Controller, Body, BadRequestError } from "routing-controllers";
import { UserController } from "@astra/controllers";
import { UserLogin, UserRegistration } from "@astra/shared";

@Controller()
export class UserApi {
  private userController = new UserController();
  @Post("/greet/:name")
  greet(@Param("name") name: string) {
    return this.userController.greetUser(name);
  }
  @Post("/login")
  login(@Body() request: UserLogin) {
    try {
      return this.userController.login(request);
    } catch (err) {
      throw new BadRequestError("Invalid Login Credentials. ");
    }
  }
  @Post("/register")
  register(@Body({ required: true}) request: UserRegistration) {
    return this.userController.register(request);
  }
}
