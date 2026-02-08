// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { LocalStrategy } from './local.strategy';
// import { JwtStrategy } from './jwt.strategy';
// import { User } from '../entities/user.entity';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([User]),
//     PassportModule,
//     JwtModule.register({
//       secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
//       signOptions: { expiresIn: '1d' },
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService, LocalStrategy, JwtStrategy],
//   exports: [AuthService],
// })
// export class AuthModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: 'your-super-secret-jwt-key-change-this-in-production', // Hardcode for now
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}