import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/(?=.*[!@#$%^&*])/, { message: 'Password must contain at least one special character' })
  newPassword: string;
}