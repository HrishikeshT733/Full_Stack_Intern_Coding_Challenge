import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, Matches, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from 'src/entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty() // Remove IsOptional and add IsNotEmpty
  @IsString()
  @MaxLength(400)
  address: string; // Remove the ? to make it required

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.USER;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/(?=.*[A-Z])/, { 
    message: 'Password must contain at least one uppercase letter' 
  })
  @Matches(/(?=.*[a-z])/, { 
    message: 'Password must contain at least one lowercase letter' 
  })
  @Matches(/(?=.*\d)/, { 
    message: 'Password must contain at least one number' 
  })
  @Matches(/(?=.*[!@#$%^&*])/, { 
    message: 'Password must contain at least one special character (!@#$%^&*)' 
  })
  password: string;
}