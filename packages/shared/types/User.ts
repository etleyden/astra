import {Goal} from "./Goal";
import {Account} from "./Account";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";
import { IsStrongPassword } from "class-validator";

export type User = {
    guid: string;
    email: string;
    first_name: string;
    last_name?: string;
    goals?: Goal[];
    accounts?: Account[];
}

/**
 * A stripped down class that contains a password
 * field. This keeps the password out of the main
 * User class and while we're at it we only need the
 * login data.
 */
export class UserLogin {
    @IsEmail()
    email!: string;
    
    // @IsStrongPassword() uncomment this in prod
    @IsString()
    password!: string;
}

export class UserRegistration extends UserLogin {
    @IsString()
    first_name?: string;

    @IsString()
    last_name?: string;
}
export type LoginResponse = {
    error?: string;
    token?: string;
    user?: User;
}