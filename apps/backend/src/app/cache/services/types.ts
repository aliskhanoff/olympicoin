
interface CacheEntry<T> {
    value: T;
    expiresAt: number | null;
}

export class CacheManager {
    
    private cache: ICache;

    constructor(protected caches: ICache[] = [new InMemoryCache()]) {
        const actualCache = process.env.INITIAL_CACHE || "memory";
        this.cache = caches.find(c => c.name === actualCache)
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        return await this.cache.set(key, value, ttl);
    }

    async get<T>(key: string): Promise<T | string | undefined> {
        return await this.cache.get(key)
    }

    async del(key: string): Promise<void> {
        return await this.cache.del(key)
    }

    async clear(): Promise<void> {
        return await this.cache.clear()
    }
    
}

export class InMemoryCache implements ICache {
    name = "memory";
    
    private cache: Map<string, CacheEntry<unknown>>;
    private interval: ReturnType<typeof setInterval> = null;

    constructor(ttl = 0) {
        if(ttl > 0) 
            this.interval = setInterval( () => {
                
                const now = Date.now(); 
                
                for (const [key, entry] of this.cache.entries()) {
                    if (entry.expiresAt && now > entry.expiresAt) {
                        this.cache.delete(key);
                    }
                }
        }, ttl)
        this.cache = new Map<string, CacheEntry<unknown>>();        
    }
    
    async set<T>(key: string, value: T, ttlInSeconds?: number): Promise<void> {
        const expiresAt = ttlInSeconds ? Date.now() + ttlInSeconds * 1000 : null;
        this.cache.set(key, { value, expiresAt });
    }
    
    async get<T>(key: string): Promise<T | string | undefined> {
        const entry = this.cache.get(key);
        
        if (!entry) return undefined;
        
        if (entry.expiresAt && Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return undefined;
        }

        return entry.value as T
    }

    async del(key: string): Promise<void> {
        this.cache.delete(key)
    }

    async clear(): Promise<void> {
        this.cache.clear()
    }

}

export interface ICache {

    name: string

    set<T>(key: string, value: T, ttl?: number): Promise<void>;
  
    get<T>(key: string): Promise<T | string | undefined>;
  
    del(key: string): Promise<void>;

    clear(): Promise<void>;
}
