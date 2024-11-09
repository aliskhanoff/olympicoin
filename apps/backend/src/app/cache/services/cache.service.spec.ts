import { Test, type TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { join } from 'node:path';
import { ConfigModule } from '@nestjs/config';

describe('Cache Manager', () => {
  let service: CacheService;

  beforeAll(async () => {
    process.env.INITIAL_CACHE = "memory"

    const module: TestingModule = await Test.createTestingModule({
      
      imports: [
          ConfigModule.forRoot({
            envFilePath: [ join(__dirname, '../../../', '.env.local') ]
          })
      ],

      providers: [CacheService],
      exports: [CacheService],
    })
    .compile();

    service = module.get<CacheService>(CacheService);

  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  })

  it('should set an element to a cache', async () => {
    jest.useFakeTimers()
    await service.getCache().set('foo', 'bar', 1000, "some_collection");
    jest.advanceTimersByTime(2000)
    
    const removedElementFromCache = await service.getCache().get('foo', "some_collection")
    expect(removedElementFromCache).toBeUndefined()
  })

});