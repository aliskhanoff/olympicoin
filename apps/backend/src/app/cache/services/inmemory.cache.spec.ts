import { InMemoryCache } from './types';

describe('InMemoryCache with cleanup interval', () => {
    let cache: InMemoryCache;

    beforeEach(() => {
        cache = new InMemoryCache(50);
        jest.useFakeTimers();
    });

    afterEach(() => {
        cache.close(); 
    });

    test('should automatically delete expired entries', async () => {
        await cache.set('key1', 'value1', 30)
        
        jest.advanceTimersByTime(29) 
        expect(cache.get('key1')).resolves.toBe('value1')
        jest.advanceTimersByTime(100) 

        const result = await cache.get('key1')
        expect(result).toBeUndefined()
    })

    test('should automatically delete the collection', async () => {
        await cache.set('key1', 'value1', 30, 'values')
        
        jest.advanceTimersByTime(29) 
        expect(cache.get('key1', 'values')).resolves.toBe('value1')
        jest.advanceTimersByTime(100) 

        const result = await cache.get('key1', 'values')
        expect(result).toBeUndefined()
    })

    test('should automatically delete the collection', async () => {
        await cache.set('key1', 'value1', 30, 'values')
        
        jest.advanceTimersByTime(29) 
        expect(cache.get('key1', 'values')).resolves.toBe('value1')
        jest.advanceTimersByTime(100) 

        const result = await cache.get('key1', 'values')
        expect(result).toBeUndefined()
    })

    test('should delete element from cache', async () => {
        await cache.set('key1', 'value1')
        await cache.del('key1');

        const result = await cache.get('key1')
        expect(result).toBeUndefined()
    })

    test('should delete element from collection', async () => {
        await cache.set("key1", "value1", 10000, "values")
        await cache.del("key1", "values");

        const result = await cache.get("key1")
        expect(result).toBeUndefined()
    })

    test('should clear all elements from the collection', async () => {
        await cache.set("key1", "value1", 10000, "values")
        await cache.set("key2", "value1", 10000, "values")
        

        await cache.clear("values")
        const result = await cache.get("key1", "value1")
        expect(result).toBeUndefined()
    })

});