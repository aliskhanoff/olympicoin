import { Injectable, Inject } from '@nestjs/common';
import type { CacheManager, ICache } from './types';

@Injectable()
export class CacheService {

  constructor(@Inject("CACHE_MANAGER") private cacheManager: CacheManager) {}

  async set<T>(key: string, value: T, ttl?:number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async get<T>(key: string): Promise<T | string | undefined> {
    return await this.cacheManager.get<T>(key);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async clear(): Promise<void> {
    this.cacheManager.clear();
  }
}