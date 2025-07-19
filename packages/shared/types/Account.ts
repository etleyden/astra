import { User } from "./User";
import { Vendor } from "./Vendor";

/**
 * this should match the definition in db/entities/Account.ts
 * it is not simply imported to maintain separation of
 * concerns between the DB and universal types.
 */
export enum AccountType {
  CHECKING = "checking",
  SAVINGS = "savings",
}
export type Account = {
    guid: string;
    name: string;
    bank: Vendor;
    user: User;
    accountType: AccountType;
}
export { Account as default}; // needed for types when there are multiple exports