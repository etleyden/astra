import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Category {
  @Unique(["name", "user"])
  @PrimaryGeneratedColumn("uuid")
  guid!: string;

  @Column()
  name!: string;

  @Column()
  description?: string;

  @ManyToOne(() => User)
  user!: User;

  @Column()
  icon?: string;
}
