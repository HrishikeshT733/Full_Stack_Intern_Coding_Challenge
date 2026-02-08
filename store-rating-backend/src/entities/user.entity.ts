import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Rating } from './rating.entity';
import { Store } from './store.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  STORE_OWNER = 'store_owner'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ length: 400 ,nullable: true})
  address: string ;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;

  @OneToMany(() => Rating, rating => rating.user)
  ratings: Rating[];

  // @OneToOne(() => Store, store => store.owner)
  // store: Store;

  @OneToMany(() => Store, store => store.owner)
stores: Store[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}