// A filler controller just to get the api directory set up
import { Get, JsonController } from "routing-controllers";

@JsonController("/hello")
export class HelloApi {
  @Get("/")
  sayHello() {
    return { message: "Hello World!" };
  }
}
