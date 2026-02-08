import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { Store } from '../entities/store.entity';
import { User } from '../entities/user.entity';
import { Rating } from '../entities/rating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, User, Rating])],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}