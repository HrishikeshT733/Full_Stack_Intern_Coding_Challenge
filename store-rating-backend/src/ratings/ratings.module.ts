import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import { Rating } from '../entities/rating.entity';
import { Store } from '../entities/store.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Store, User])],
  controllers: [RatingsController],
  providers: [RatingsService],
  exports: [RatingsService],
})
export class RatingsModule {}