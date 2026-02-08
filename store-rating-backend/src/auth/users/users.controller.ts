import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { RolesGuard } from '../roles.guard';
import { Roles } from '../roles.decorator';
import { UserRole } from 'src/entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() userData: any, @Request() req) {
    return this.usersService.createUser(userData, req.user.role);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll(@Query() filters: any) {
    return this.usersService.findAll(filters);
  }

  @Get('dashboard')
  @Roles(UserRole.ADMIN)
  getDashboardStats() {
    return this.usersService.getDashboardStats();
  }

  @Get('store-ratings')
  @Roles(UserRole.STORE_OWNER)
  getStoreRatings(@Request() req) {
    return this.usersService.getStoreRatings(req.user.id);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}