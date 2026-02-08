import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { StoresService } from './stores.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('stores')
@UseGuards(JwtAuthGuard)
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() storeData: any, @Request() req) {
    return this.storesService.createStore(storeData, storeData.ownerId);
  }

  @Get()
  findAll(@Query() filters: any, @Request() req) {
    // For normal users, pass userId to include their ratings
    const userId = req.user.role === UserRole.USER ? req.user.id : undefined;
    return this.storesService.findAll(filters, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(+id);
  }
}