import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Category } from "./Category";
import { Account } from "./Account";
import { Vendor } from "./Vendor";
import { User } from "./User";

export enum TransactionStatus {
  PENDING = "pending",
  POSTED = "posted",
  DECLINED = "declined",
}

export enum TransactionType {
  CREDIT = "credit",
  DEBIT = "debit",
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  guid!: string;

  @ManyToOne(() => Account)
  account!: Account;

  @ManyToOne(() => Vendor)
  vendor?: Vendor;

  @ManyToOne(() => Category)
  category!: Category;

  @Column({
    type: "enum",
    enum: TransactionStatus,
    default: TransactionStatus.POSTED,
  })
  status!: TransactionStatus;

  @Column()
  date!: Date;

  @Column({
    type: "enum",
    enum: TransactionType,
    default: TransactionType.DEBIT,
  })
  type!: TransactionType;

  // marks transactions that have been reviewed by the user
  // is_reviewed == true means the user has seen this
  // transaction, and believes it to reflect reality
  // -- namely that the category is accurate
  @Column({
    default: false,
  })
  is_reviewed!: boolean;

  @ManyToOne(() => User)
  user!: User;

  // User provided notes on the transactions
  // i.e. "This purchase from Costco was a new TV, not groceries"
  @Column()
  notes!: string;

  // User-editable, bank provided description of the transaction
  // i.e. "COSTCO 3984XXXXX"
  @Column()
  description!: string;

  @Column()
  amount: number;
}
