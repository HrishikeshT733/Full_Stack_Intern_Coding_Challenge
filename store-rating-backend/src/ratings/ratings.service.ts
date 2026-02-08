import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../entities/rating.entity';
import { Store } from '../entities/store.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // async submitRating(userId: number, storeId: number, ratingValue: number): Promise<Rating> {
  //   // Check if rating already exists
  //   const existingRating = await this.ratingRepository.findOne({
  //     where: { user: { id: userId }, store: { id: storeId } }
  //   });

  //   const user = await this.userRepository.findOne({ where: { id: userId } });
  //   const store = await this.storeRepository.findOne({ where: { id: storeId } });

  //   if (!user || !store) {
  //     throw new Error('User or store not found');
  //   }

  //   if (existingRating) {
  //     // Update existing rating
  //     existingRating.rating = ratingValue;
  //     return this.ratingRepository.save(existingRating);
  //   } else {
  //     // Create new rating
  //     const rating = this.ratingRepository.create({
  //       rating: ratingValue,
  //       user,
  //       store,
  //     });
  //     return this.ratingRepository.save(rating);
  //   }
  // }




//   async submitRating(userId: number, storeId: number, ratingValue: number): Promise<any> {
//   // Check if user exists
//   const user = await this.userRepository.findOneBy({ id: userId });
//   if (!user) throw new Error('User not found');
  
//   // Check if store exists
//   const store = await this.storeRepository.findOneBy({ id: storeId });
//   if (!store) throw new Error('Store not found');
  
//   // Check for existing rating
//   let rating = await this.ratingRepository.findOne({
//     where: { userId, storeId }
//   });
  
//   if (rating) {
//     // Update existing
//     rating.rating = ratingValue;
//   } else {
//     // Create new
//     rating = this.ratingRepository.create({
//       rating: ratingValue,
//       userId,
//       storeId,
//       user,
//       store
//     });
//   }
  
//   const savedRating = await this.ratingRepository.save(rating);
  
//   return {
//     success: true,
//     message: rating.id ? 'Rating updated' : 'Rating submitted',
//     rating: savedRating
//   };
// }


async submitRating(userId: number, storeId: number, ratingValue: number): Promise<Rating> {
  // Validate rating value
  if (ratingValue < 1 || ratingValue > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  // Check if rating already exists for this user and store
  const existingRating = await this.ratingRepository.findOne({
    where: { userId, storeId }
  });

  if (existingRating) {
    // Update existing rating
    existingRating.rating = ratingValue;
    return this.ratingRepository.save(existingRating);
  }

  // Create new rating
  const user = await this.userRepository.findOne({ where: { id: userId } });
  const store = await this.storeRepository.findOne({ where: { id: storeId } });

  if (!user) {
    throw new Error('User not found');
  }
  
  if (!store) {
    throw new Error('Store not found');
  }

  const rating = this.ratingRepository.create({
    rating: ratingValue,
    userId: user.id,
    storeId: store.id,
    user,
    store
  });
  
  return this.ratingRepository.save(rating);
}

  async getUserRating(userId: number, storeId: number): Promise<Rating | null> {
    return this.ratingRepository.findOne({
      where: { user: { id: userId }, store: { id: storeId } }
    });
  }


//   async getUserRating(userId: number, storeId: number): Promise<any> {
//   const rating = await this.ratingRepository.findOne({
//     where: { userId, storeId },
//     select: ['id', 'rating', 'createdAt'] // Only select needed fields
//   });
//   return rating;
// }
}