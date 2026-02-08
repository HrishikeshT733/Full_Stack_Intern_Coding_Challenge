import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('update-password')
  // async updatePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
  //   return this.authService.updatePassword(req.user.id, updatePasswordDto.newPassword);
  // }


  @UseGuards(JwtAuthGuard)
@Post('update-password')
async updatePassword(@Request() req, @Body() updatePasswordDto: UpdatePasswordDto) {
  await this.authService.updatePassword(req.user.id, updatePasswordDto.newPassword);
  return {
    success: true,
    message: 'Password updated successfully'
  };
}

 @UseGuards(JwtAuthGuard)
@Get('profile')
async getProfile(@Request() req) {
  return this.authService.getProfile(req.user.id);
}

  @Get('check-token')
@UseGuards(JwtAuthGuard)
checkToken(@Request() req) {
  console.log('Request user:', req.user);
  return {
    message: 'Token is valid',
    user: req.user
  };
}


// @UseGuards(JwtAuthGuard)
// @Get('profile')
// getProfile(@Request() req) {
//   console.log('Profile request user:', req.user); // Debug log
//   return {
//     id: req.user.id,
//     email: req.user.email,
//     role: req.user.role,
//     // We need to get the full user details from database
//   };
// }
}

