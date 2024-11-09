import { Injectable, Inject } from '@nestjs/common';
import { CacheManager, type ICache, InMemoryCache } from './types';
import { ConfigService } from '@nestjs/config';

const DEFAULT_CLEANUP_CACHE_INTERVAL_MS = 1500;

@Injectable()
export class CacheService {

  private cacheManager: CacheManager;

  constructor(@Inject(ConfigService) configService: ConfigService) {
    const useCache = configService.get("INITIAL_CACHE_TYPE")
    const cacheCleanupTimeoutMS = configService.get("CLEANUP_CACHE_INTERVAL_MS") || DEFAULT_CLEANUP_CACHE_INTERVAL_MS
    this.cacheManager = new CacheManager([new InMemoryCache()], useCache, cacheCleanupTimeoutMS)
  }

  public getCache(): CacheManager {
      return this.cacheManager;
  }


}