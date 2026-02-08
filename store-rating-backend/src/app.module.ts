import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Store } from './entities/store.entity';
import { Rating } from './entities/rating.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './auth/users/users.module';
import { StoresModule } from './stores/stores.module';
import { RatingsModule } from './ratings/ratings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'hrishikesh',
      database: process.env.DB_NAME || 'store_rating_db',
      driver: require('mysql2'),
      entities: [User, Store, Rating],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    UsersModule,
    StoresModule,
    RatingsModule,
  ],
})
export class AppModule {}