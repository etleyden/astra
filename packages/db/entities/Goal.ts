import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Category } from "./Category";
import { Account } from "./Account";

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

@Entity()
export class Goal {
  @PrimaryGeneratedColumn("uuid")
  guid!: string;

  @ManyToOne(() => User, (user) => user.goals)
  user!: User;

  @Column({
    type: "enum",
    enum: GoalType,
  })
  type!: GoalType;

  @Column()
  amount!: number;

  @ManyToOne(() => Category, { nullable: true })
  category?: Category;

  // must be populated if interval is populated
  @Column()
  start_date?: Date;

  // must be populated if is_recurring is false
  // no interval means the goal must have a deadline
  @Column()
  end_date?: Date;

  @Column()
  date_created!: Date;

  @ManyToOne(() => Account)
  account?: Account;

  // can only be true for save or aggregate
  @Column()
  is_recurring!: boolean;

  // Must be not-null if is_recurring is true
  @Column({
    type: "enum",
    enum: GoalInterval,
  })
  interval?: GoalInterval;
}
