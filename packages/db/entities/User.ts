import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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
}
