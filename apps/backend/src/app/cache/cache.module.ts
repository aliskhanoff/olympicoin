import { Module, type DynamicModule, Global } from '@nestjs/common';
import { CacheService } from './services/cache.service';
import { CacheManager, InMemoryCache } from './services';

export interface CacheModuleOptions {
  stdTTL?: number;
  checkperiod?: number; 
}

@Global()
@Module({})
// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class CacheModule {
  static forRoot(options: CacheModuleOptions = {}): DynamicModule {
    const cacheInstance = new CacheManager([new InMemoryCache()])

    return {
      module: CacheModule,
      providers: [
        {
          provide: 'CACHE_MANAGER',
          useClass: CacheManager,
          useValue: cacheInstance,
        },
        CacheService,
      ],
      exports: [CacheService],
    }
  }
}