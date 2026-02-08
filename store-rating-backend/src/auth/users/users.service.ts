import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, FindOptionsWhere, ILike } from 'typeorm';
import { User,UserRole } from 'src/entities/user.entity';
import { Store } from 'src/entities/store.entity';
import { Rating } from 'src/entities/rating.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
  ) {}

  async createUser(userData: Partial<User>, creatorRole: UserRole): Promise<User> {
    // Only admin can create admin and store_owner users
    if (userData.role && creatorRole !== UserRole.ADMIN) {
      if (userData.role === UserRole.ADMIN || userData.role === UserRole.STORE_OWNER) {
        throw new ForbiddenException('Only admin can create admin or store owner users');
      }
    }
    return this.userRepository.save(userData);
  }

  async findAll(filters?: {
    name?: string;
    email?: string;
    address?: string;
    role?: UserRole;
  }): Promise<User[]> {
    const where: FindOptionsWhere<User> = {};
    
    if (filters?.name) where.name = ILike(`%${filters.name}%`);
    if (filters?.email) where.email = ILike(`%${filters.email}%`);
    if (filters?.address) where.address = ILike(`%${filters.address}%`);
    if (filters?.role) where.role = filters.role;

    return this.userRepository.find({ where });
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOneOrFail({ 
      where: { id },
      relations: ['store']
    });
  }

  async getDashboardStats() {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      this.userRepository.count(),
      this.storeRepository.count(),
      this.ratingRepository.count(),
    ]);

    return { totalUsers, totalStores, totalRatings };
  }

  // async getStoreRatings(storeOwnerId: number) {
  //   const store = await this.storeRepository.findOne({
  //     where: { owner: { id: storeOwnerId } },
  //     relations: ['ratings', 'ratings.user']
  //   });

  //   if (!store) {
  //     throw new Error('Store not found for this owner');
  //   }

  //   const averageRating = store.ratings.length > 0
  //     ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
  //     : 0;

  //   return {
  //     store: store.name,
  //     averageRating: parseFloat(averageRating.toFixed(2)),
  //     ratings: store.ratings.map(rating => ({
  //       userName: rating.user.name,
  //       rating: rating.rating,
  //       createdAt: rating.createdAt
  //     }))
  //   };
  // }


  async getStoreRatings(storeOwnerId: number) {
  const store = await this.storeRepository.findOne({
    where: { owner: { id: storeOwnerId } },
    relations: ['ratings', 'ratings.user']
  });

  if (!store) {
    return {
      store: 'No store found',
      averageRating: 0,
      totalRatings: 0,
      ratings: []
    };
  }

  let totalRating = 0;
  store.ratings.forEach(rating => {
    totalRating += rating.rating;
  });

  const averageRating = store.ratings.length > 0 
    ? totalRating / store.ratings.length 
    : 0;

  return {
    store: store.name,
    averageRating: parseFloat(averageRating.toFixed(2)),
    totalRatings: store.ratings.length,
    ratings: store.ratings.map(rating => ({
      userName: rating.user.name,
      userEmail: rating.user.email,
      rating: rating.rating,
      createdAt: rating.createdAt
    }))
  };
}
}