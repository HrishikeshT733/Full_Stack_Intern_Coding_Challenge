import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';
import { Store } from 'src/entities/store.entity';
import { Rating } from 'src/entities/rating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Store, Rating])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}