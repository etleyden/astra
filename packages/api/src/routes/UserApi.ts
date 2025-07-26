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
    if(!request) {
      console.error("Invalid Login Request (c99280fc-03ae-4d9b-a69e-e2947781f9f4)")
      throw new BadRequestError("No login object");
    }
    return this.userController.login(request);
  }
  @Post("/register")
  register(@Body({ required: true}) request: UserRegistration) {
    return this.userController.register(request);
  }
}
