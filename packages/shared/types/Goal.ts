import { User } from "./User";
import { Category } from "./Category";
import { Account } from "./Account";

/**
 * GoalType and GoalInterval are copied from the db entity
 * definition, and not imported to maintain separation
 * of concerns.
 */
export enum GoalType {
  SAVE = "save", // I want to save X amount
  BALANCE = "balance", // I want account to have balance X
  AGGREGATE = "aggregate", // I want aggregate of amount in account or category to be X
}
export enum GoalInterval {
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  ANNUALLY = "annually",
}
export type Goal = {
    guid: string;
    user: User;
    type: GoalType;
    amount: number;
    category?: Category;
    start_date?: Date;
    end_date?: Date;
    date_created: Date;
    account?: Account;
    is_recurring: boolean;
    interval?: GoalInterval;
}
export { Goal as default };