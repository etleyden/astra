import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn("uuid")
  guid!: string;

  @Column()
  name!: string;

  @Column()
  icon_url?: string;

  @Column()
  domain?: string;

  @Column()
  is_bank!: boolean;
}
