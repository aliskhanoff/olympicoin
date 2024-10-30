import { Test, type TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import {  CacheManager, InMemoryCache } from './types';

describe('Cache Manager', () => {
  let service: CacheService;

  beforeAll(async () => {
    process.env.CURRENT_CACHE = "memory"

    const module: TestingModule = await Test.createTestingModule({
        providers: [{
                provide: 'CACHE_MANAGER',
                useValue: new CacheManager([
                  new InMemoryCache(5)
                ]),
        }, CacheService],

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
    await service.set('foo', 'bar');
    
    const resultShouldBeBAR = await service.get('foo')
    expect(resultShouldBeBAR).toEqual('bar');
  })


  it('service should be defined in DI container', () => {
    expect(service).toBeDefined();
  })

  it('should set an element to a cache with timeout', async () => {
    jest.useFakeTimers(); // Включаем фейковые таймеры

    await service.set('foo', 'bar', 10);
  
    jest.advanceTimersByTime(5);
  
    expect(await service.get('foo')).toBeDefined(); // 'bar'
  
    // jest.advanceTimersByTime(11);
  
    // expect(await service.get('foo')).toBeUndefined();
  })

  it('should clear cache by a key', async () => {
    await service.set('foo', 'bar');
    await service.set('foo', 'bar1');
    await service.set('foo', 'bar2');
    await service.clear();

    expect(await service.get('foo')).toBe(undefined);
  })

  it('should add clear cache by a key', async () => {
    await service.set('foo', 'bar');
    await service.set('foo', 'bar1');
    await service.set('foo', 'bar2');
    await service.clear();

    expect(await service.get('foo')).toBeUndefined()
  })

  it("should clear manually", async () => {
    jest.useFakeTimers()
    await service.set('foo', 'bar');
    jest.advanceTimersByTime(60 * 60 * 24 * 365);
    
    await service.clear();
    expect(await service.get('foo')).toBeUndefined()
  })

});