import { User } from "./User";
export type Category = {
    guid: string;
    name: string;
    description?: string;
    user: User;
    icon?: string;
}