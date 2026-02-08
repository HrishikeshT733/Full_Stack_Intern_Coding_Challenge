import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('ratings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @Roles(UserRole.USER)
  submitRating(@Body() ratingData: { storeId: number; rating: number }, @Request() req) {
    return this.ratingsService.submitRating(req.user.id, ratingData.storeId, ratingData.rating);
  }

  @Get('store/:storeId')
  @Roles(UserRole.USER)
  getUserRating(@Param('storeId') storeId: string, @Request() req) {
    return this.ratingsService.getUserRating(req.user.id, +storeId);
  }
}