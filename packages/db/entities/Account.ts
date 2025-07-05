import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Vendor } from "./Vendor";

export enum AccountType {
  CHECKING = "checking",
  SAVINGS = "savings",
}

@Entity()
export class Account {
  @PrimaryGeneratedColumn("uuid")
  guid!: string;

  @Column()
  name!: string;

  // TODO: enforce that is_bank is true
  @ManyToOne(() => Vendor)
  bank!: Vendor;

  @ManyToOne(() => User, (user) => user.accounts)
  user!: User;

  @Column({
    type: "enum",
    enum: AccountType,
  })
  type!: AccountType;
}
