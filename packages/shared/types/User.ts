import {Goal} from "./Goal";
import {Account} from "./Account";

export type User = {
    guid: string;
    email: string;
    first_name: string;
    last_name?: string;
    goals: Goal[];
    accounts: Account[];
}

/**
 * A stripped down class that contains a password
 * field. This keeps the password out of the main
 * User class and while we're at it we only need the
 * login data.
 */
export type UserLogin = {
    email: string;
    password: string;
}
export type LoginResponse = {
    error?: string;
    token?: string;
    user?: User;
}