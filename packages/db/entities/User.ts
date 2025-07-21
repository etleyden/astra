import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Unique } from "typeorm";
import { Goal } from "./Goal";
import { Account } from "./Account";

@Entity({
  name: "app_user",
})
export class User {
  @PrimaryGeneratedColumn("uuid")
  guid!: string;

  // this will serve as the user-facing identifier
  @Column({ unique: true })
  email!: string;

  @Column()
  hashedPassword!: string;

  @Column()
  first_name!: string;

  @Column()
  last_name?: string;


  @OneToMany(() => Goal, (goal) => goal.user)
  goals?: Goal[];

  @OneToMany(() => Account, (account) => account.user)
  accounts?: Account[];
}
