import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { Store } from '../entities/store.entity';
import { User, UserRole } from '../entities/user.entity';
import { Rating } from '../entities/rating.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
  ) {}

  // async createStore(storeData: Partial<Store>, ownerId: number): Promise<Store> {
  //   const owner = await this.userRepository.findOne({ where: { id: ownerId, role: UserRole.STORE_OWNER } });
  //   if (!owner) {
  //     throw new Error('User is not a store owner or does not exist');
  //   }

  //   const store = this.storeRepository.create({
  //     ...storeData,
  //     owner,
  //   });
  //   return this.storeRepository.save(store);
  // }


  async createStore(storeData: Partial<Store>, ownerId: number): Promise<Store> {
  const owner = await this.userRepository.findOne({ 
    where: { id: ownerId, role: UserRole.STORE_OWNER } 
  });
  
  if (!owner) {
    throw new Error('User is not a store owner or does not exist');
  }

  const store = this.storeRepository.create({
    ...storeData,
    owner,
  });
  
  return this.storeRepository.save(store);
}

  async findAll(filters?: {
    name?: string;
    email?: string;
    address?: string;
  }, userId?: number): Promise<any[]> {
    const where: FindOptionsWhere<Store> = {};
    
    if (filters?.name) where.name = ILike(`%${filters.name}%`);
    if (filters?.email) where.email = ILike(`%${filters.email}%`);
    if (filters?.address) where.address = ILike(`%${filters.address}%`);

    const stores = await this.storeRepository.find({ 
      where,
      relations: ['ratings', 'owner']
    });

    // For normal users, include their rating
    if (userId) {
      const userRatings = await this.ratingRepository.find({
        where: { user: { id: userId } },
        relations: ['store']
      });

      const ratingMap = new Map();
      userRatings.forEach(r => ratingMap.set(r.store.id, r.rating));

      return stores.map(store => ({
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        overallRating: store.ratings.length > 0
          ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
          : 0,
        userRating: ratingMap.get(store.id) || null,
        totalRatings: store.ratings.length
      }));
    }

    return stores.map(store => ({
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      ownerName: store.owner?.name,
      rating: store.ratings.length > 0
        ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
        : 0,
      totalRatings: store.ratings.length
    }));
  }

  async findOne(id: number): Promise<Store> {
    return this.storeRepository.findOneOrFail({ 
      where: { id },
      relations: ['ratings', 'owner']
    });
  }
}