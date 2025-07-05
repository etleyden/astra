import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Goal } from "./Goal";
import { Account } from "./Account";

@Entity({
  name: "app_user",
})
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  first_name!: string;

  @Column()
  last_name?: string;

  @Column()
  email: string;

  @OneToMany(() => Goal, (goal) => goal.user)
  goals: Goal[];

  @OneToMany(() => Account, (account) => account.user)
  accounts: User[];
}
