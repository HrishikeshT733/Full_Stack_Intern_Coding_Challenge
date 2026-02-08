// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import * as bcrypt from 'bcryptjs';
// import { User, UserRole } from '../entities/user.entity';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//     private jwtService: JwtService,
//   ) {}

//   async validateUser(email: string, password: string): Promise<any> {
//     const user = await this.userRepository.findOne({ where: { email } });
//     if (user && await bcrypt.compare(password, user.password)) {
//       const { password, ...result } = user;
//       return result;
//     }
//     return null;
//   }

//   async login(user: any) {
//     const payload = { 
//       email: user.email, 
//       sub: user.id,
//       role: user.role 
//     };
//     return {
//       access_token: this.jwtService.sign(payload),
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         address: user.address
//       }
//     };
//   }

//   async register(userData: Partial<User>): Promise<User> {
//     const hashedPassword = await bcrypt.hash(userData.password, 10);
//     const user = this.userRepository.create({
//       ...userData,
//       password: hashedPassword,
//     });
//     return this.userRepository.save(user);
//   }

//   async updatePassword(userId: number, newPassword: string): Promise<void> {
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     await this.userRepository.update(userId, { password: hashedPassword });
//   }
// }



// import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import * as bcrypt from 'bcryptjs';
// import { User, UserRole } from '../entities/user.entity';
// import { CreateUserDto } from './dto/create-user.dto';

// export interface LoginResponse {
//   access_token: string;
//   user: {
//     id: number;
//     name: string;
//     email: string;
//     role: UserRole;
//     address?: string;
//   };
// }

// export type UserWithoutPassword = Omit<User, 'password'>;

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//     private jwtService: JwtService,
//   ) {}

//   async validateUser(email: string, password: string): Promise<UserWithoutPassword | null> {
//     const user = await this.userRepository.findOne({ where: { email } });
    
//     if (!user) {
//       return null;
//     }
    
//     const isPasswordValid = await bcrypt.compare(password, user.password);
    
//     if (!isPasswordValid) {
//       return null;
//     }
    
//     // Remove password from returned object
//     const { password: _, ...userWithoutPassword } = user;
//     return userWithoutPassword;
//   }

//   async login(user: UserWithoutPassword): Promise<LoginResponse> {
//     const payload = { 
//       email: user.email, 
//       sub: user.id,
//       role: user.role 
//     };
    
//     return {
//       access_token: this.jwtService.sign(payload),
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         address: user.address
//       }
//     };
//   }

//   async register(createUserDto: CreateUserDto): Promise<User> {
//     // Check if user already exists
//     const existingUser = await this.userRepository.findOne({ 
//       where: { email: createUserDto.email } 
//     });
    
//     if (existingUser) {
//       throw new BadRequestException('Email already registered');
//     }
    
//     const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
//     const user = this.userRepository.create({
//       name: createUserDto.name,
//       email: createUserDto.email,
//       address: createUserDto.address,
//       password: hashedPassword,
//       role: createUserDto.role || UserRole.USER,
//     });
    
//     return this.userRepository.save(user);
//   }

//   async updatePassword(userId: number, newPassword: string): Promise<void> {
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     await this.userRepository.update(userId, { password: hashedPassword });
//   }
// }



// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import * as bcrypt from 'bcryptjs';
// import { User, UserRole } from '../entities/user.entity';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//     private jwtService: JwtService,
//   ) {}

//   async validateUser(email: string, password: string): Promise<any> {
//     const user = await this.userRepository.findOne({ where: { email } });
    
//     if (!user) {
//       return null;
//     }
    
//     const isPasswordValid = await bcrypt.compare(password, user.password);
    
//     if (isPasswordValid) {
//       const { password, ...result } = user;
//       return result;
//     }
    
//     return null;
//   }

//   async login(user: any) {
//     const payload = { 
//       email: user.email, 
//       sub: user.id,
//       role: user.role 
//     };
    
//     return {
//       access_token: this.jwtService.sign(payload),
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         address: user.address
//       }
//     };
//   }

//   async register(userData: Partial<User>): Promise<User> {
//     // Check if user already exists
//     const existingUser = await this.userRepository.findOne({ 
//       where: { email: userData.email } 
//     });
    
//     if (existingUser) {
//       throw new Error('User with this email already exists');
//     }
    
//     const hashedPassword = await bcrypt.hash(userData.password, 10);
//     const user = this.userRepository.create({
//       ...userData,
//       password: hashedPassword,
//     });
    
//     return this.userRepository.save(user);
//   }

//   async updatePassword(userId: number, newPassword: string): Promise<void> {
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     await this.userRepository.update(userId, { password: hashedPassword });
//   }
// }


// import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import * as bcrypt from 'bcryptjs';
// import { User, UserRole } from '../entities/user.entity';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//     private jwtService: JwtService,
//   ) {}

//   async validateUser(email: string, password: string): Promise<any> {
//     const user = await this.userRepository.findOne({ where: { email } });
    
//     if (!user) {
//       return null;
//     }
    
//     const isPasswordValid = await bcrypt.compare(password, user.password);
    
//     if (isPasswordValid) {
//       const { password: _, ...result } = user; // Use alias to avoid naming conflict
//       return result;
//     }
    
//     return null;
//   }

//   async login(user: any) {
//     const payload = { 
//       email: user.email, 
//       sub: user.id,
//       role: user.role 
//     };
    
//     return {
//       access_token: this.jwtService.sign(payload),
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         address: user.address
//       }
//     };
//   }

//   async register(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
//     // Check if user already exists
//     const existingUser = await this.userRepository.findOne({ 
//       where: { email: userData.email } 
//     });
    
//     if (existingUser) {
//       throw new ConflictException('User with this email already exists');
//     }
    
//     // Validate required fields
//     if (!userData.password) {
//       throw new BadRequestException('Password is required');
//     }
    
//     const hashedPassword = await bcrypt.hash(userData.password, 10);
    
//     // Create user without spreading password separately
//     const user = this.userRepository.create({
//       name: userData.name,
//       email: userData.email,
//       password: hashedPassword,
//       role: userData.role || UserRole.USER, // Provide default role
//       address: userData.address,
//     });
    
//     return await this.userRepository.save(user);
//   }

//   async updatePassword(userId: number, newPassword: string): Promise<void> {
//     if (!newPassword) {
//       throw new BadRequestException('New password is required');
//     }
    
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     await this.userRepository.update(userId, { password: hashedPassword });
//   }
// }



// import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import * as bcrypt from 'bcryptjs';
// import { User, UserRole } from '../entities/user.entity';
// import { CreateUserDto } from './dto/create-user.dto'; // Import CreateUserDto

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//     private jwtService: JwtService,
//   ) {}

//   async validateUser(email: string, password: string): Promise<any> {
//     const user = await this.userRepository.findOne({ where: { email } });
    
//     if (!user) {
//       return null;
//     }
    
//     const isPasswordValid = await bcrypt.compare(password, user.password);
    
//     if (isPasswordValid) {
//       const { password: _, ...result } = user; // Use alias to avoid naming conflict
//       return result;
//     }
    
//     return null;
//   }

//   async login(user: any) {
//     const payload = { 
//       email: user.email, 
//       sub: user.id,
//       role: user.role 
//     };
    
//     return {
//       access_token: this.jwtService.sign(payload),
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         address: user.address
//       }
//     };
//   }

//   async register(createUserDto: CreateUserDto): Promise<User> { // Change parameter type to CreateUserDto
//     // Check if user already exists
//     const existingUser = await this.userRepository.findOne({ 
//       where: { email: createUserDto.email } 
//     });
    
//     if (existingUser) {
//       throw new ConflictException('User with this email already exists');
//     }
    
//     // Validate required fields
//     if (!createUserDto.password) {
//       throw new BadRequestException('Password is required');
//     }
    
//     const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
//     // Create user object with all required properties
//     const userData = {
//       name: createUserDto.name,
//       email: createUserDto.email,
//       address: createUserDto.address || null, // Handle optional address
//       password: hashedPassword,
//       role: createUserDto.role || UserRole.USER,
//       ratings: [], // Default value for ratings
//       store: null, // Default value for store
//     };
    
//     const user = this.userRepository.create(userData);
//     return await this.userRepository.save(user);
//   }

//   async updatePassword(userId: number, newPassword: string): Promise<void> {
//     if (!newPassword) {
//       throw new BadRequestException('New password is required');
//     }
    
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     await this.userRepository.update(userId, { password: hashedPassword });
//   }
// }



import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (isPasswordValid) {
      const { password: _, ...result } = user;
      return result;
    }
    
    return null;
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id,
      role: user.role 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address
      }
    };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ 
      where: { email: createUserDto.email } 
    });
    
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    
    // Validate required fields
    if (!createUserDto.password) {
      throw new BadRequestException('Password is required');
    }
    
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    // Create user entity instance directly
    const user = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.address = createUserDto.address || "";
    user.password = hashedPassword;
    user.role = createUserDto.role || UserRole.USER;
    // ratings and store will use their default values from the entity definition
    
    return await this.userRepository.save(user);
  }

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    if (!newPassword) {
      throw new BadRequestException('New password is required');
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password: hashedPassword });
  }



  async getProfile(userId: number): Promise<any> {
  const user = await this.userRepository.findOne({ 
    where: { id: userId },
    select: ['id', 'name', 'email', 'address', 'role', 'createdAt']
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
}
}