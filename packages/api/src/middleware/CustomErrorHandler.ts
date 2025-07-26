import {
  Middleware,
  HttpError,
  ExpressMiddlewareInterface,
} from "routing-controllers";
import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { UserLogin } from "@astra/shared";
import { validate } from "class-validator";

/**
 * This class contains logic to perform validation checks & respond with a custom response
 * when it makes sense to do so.
 */
@Middleware({ type: "before" })
export class CustomErrorHandler implements ExpressMiddlewareInterface {
  async use(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const route = `${request.method.toUpperCase()} ${request.path}`;
    // TODO: think about making this an object map of unit-testable functions
    // instead of a potentially messy switch statement.
    switch (route) {
      case "POST /login":
        const login_dto = plainToInstance(UserLogin, request.body);
        await validate(login_dto).then((errors) => {
          if (errors.length) {
            console.error(errors);
            throw new HttpError(401, "Invalid credentials");
          } else {
            request.body = login_dto;
          }
        });
        break;
      default:
        break;
    }
    next();
  }
}
