import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Rating } from './rating.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 400 })
  address: string;

  // @OneToOne(() => User, user => user.store)
  // @JoinColumn()
  // owner: User;

  @ManyToOne(() => User, user => user.stores)
@JoinColumn({ name: 'ownerId' })
owner: User;

@Column()
ownerId: number;

  @OneToMany(() => Rating, rating => rating.store)
  ratings: Rating[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}