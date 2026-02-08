import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './user.entity';
import { Store } from './store.entity';

// @Entity('ratings')
// @Unique(['user', 'store'])
// export class Rating {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ type: 'int' })
//   rating: number;

//   @ManyToOne(() => User, user => user.ratings)
//   @JoinColumn({ name: 'userId' })
//   user: User;

//   @Column()
//   userId: number;

//   @ManyToOne(() => Store, store => store.ratings)
//   @JoinColumn({ name: 'storeId' })
//   store: Store;

//   @Column()
//   storeId: number;

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   createdAt: Date;
// }

@Entity('ratings')
@Unique(['userId', 'storeId']) // Ensure unique rating per user per store
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  rating: number;

  @ManyToOne(() => User, user => user.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Store, store => store.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column()
  storeId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}