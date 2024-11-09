
interface CacheEntry<T> {
    value: T;
    expiresAt: number | null;
    collectionName: string;
}

type IntervalType = ReturnType<typeof setInterval>;

const USE_CACHE = 'memory'

export class CacheManager implements ICache {
    
    private cache: ICache;
    name: string;

    constructor(protected caches: ICache[], useCache = USE_CACHE, cleanInterval = 1500) {
        const _caches = caches || [new InMemoryCache(cleanInterval)]
        
        const actualCache = useCache || process.env.INITIAL_CACHE || USE_CACHE;
        this.cache = _caches.find(c => c.name === actualCache)
        this.name = this.cache.name
    }
    

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        return await this.cache.set(key, value, ttl);
    }

    async get<T>(key: string): Promise<T | undefined> {
        return await this.cache.get(key)
    }

    async getAll<T>(collectionName?: string): Promise<T[] | undefined> {
        
        if(!collectionName) return 

        return this.cache.getAll<T>()
    }

    async del(key: string): Promise<void> {
        return await this.cache.del(key)
    }

    async has(key: string): Promise<boolean> {
        return await this.cache.has(key)
    }

    async clear(collectionName?: string): Promise<void> {
        return await this.cache.clear(collectionName)
    }
    
}

const BASE_COLLECTION_NAME = "$BASE"
const CACHE_TIMEOUT = 1500


export class InMemoryCache implements ICache {
    private cache: Map<string, CacheEntry<unknown>> = new Map();
    private cleanupIntervalId: IntervalType;
    public name = "memory";

    constructor(cleanupInterval = CACHE_TIMEOUT) {
        this.cleanupIntervalId = setInterval(() => {
            this.cleanup();
        }, cleanupInterval);
    }

    private generateKey(key: string, collectionName?: string): string {
        return `${collectionName || BASE_COLLECTION_NAME}:${key}`;
    }

    private isExpired(entry: CacheEntry<unknown>): boolean {
        return entry.expiresAt !== null && entry.expiresAt <= Date.now();
    }

    private cleanup(): void {
        for (const [key, entry] of this.cache.entries()) {
            if (this.isExpired(entry)) {
                this.cache.delete(key);
            }
        }
    }

    public async set<T>(key: string, value: T, ttl?: number, collectionName?: string): Promise<void> {
        const expiresAt = ttl ? Date.now() + ttl : null;
        const cacheKey = this.generateKey(key, collectionName);
        this.cache.set(cacheKey, { value, expiresAt, collectionName: collectionName || BASE_COLLECTION_NAME });
    }

    public async get<T>(key: string, collectionName?: string): Promise<T | undefined> {
        const cacheKey = this.generateKey(key, collectionName);
        const entry = this.cache.get(cacheKey);
        
        if (entry && !this.isExpired(entry)) return entry.value as T;

        // biome-ignore lint/style/noUselessElse: <explanation>
        else if (entry) {
            this.cache.delete(cacheKey)
        }

        return undefined;
    }

    public async getAll<T>(collectionName?: string): Promise<T[] | undefined> {
        const items: [] = [];
        for (const [key, entry] of this.cache.entries()) {
            
            if (entry.collectionName === (collectionName || BASE_COLLECTION_NAME) && !this.isExpired(entry)) {
                items.push({ [key]: entry.value, collectionName: entry.collectionName } as never);
            }
            
            else if (this.isExpired(entry)) {
                this.cache.delete(key)
            }

        }
        return items.length > 0 ? items as T[] : undefined;
    }

    public async has(key: string, collectionName?: string): Promise<boolean> {
        const cacheKey = this.generateKey(key, collectionName);
        const entry = this.cache.get(cacheKey);
        if (entry && !this.isExpired(entry)) {
            return true;
        // biome-ignore lint/style/noUselessElse: <explanation>
        } else if (entry) {
            this.cache.delete(cacheKey);
        }
        return false;
    }

    public async del(key: string, collectionName?: string): Promise<void> {
        
        if(!collectionName) {
            await this.cache.delete(key)    
        }

        const cacheKey = this.generateKey(key, collectionName);
        await this.cache.delete(cacheKey)
        
    }

    public async clear(collectionName?: string): Promise<void> {

        if(!collectionName) return this.cache.clear()

        for (const [key, entry] of this.cache.entries()) {
            if (entry.collectionName === (collectionName || BASE_COLLECTION_NAME)) {
                this.cache.delete(key);
            }
        }

    }

    public close(): void {
        clearInterval(this.cleanupIntervalId);
    }
}


export interface ICache {

    name: string

    set<T>(key: string, value: T, ttl?: number, collectionName?: string): Promise<void>;
  
    get<T>(key: string, collectionName?: string): Promise<T | undefined>;
    
    getAll<T>(collectionName?: string): Promise<T[] | undefined>;
    
    has(key: string, collectionName?: string): Promise<boolean>

    del(key: string, collectionName?: string): Promise<void>;

    clear(collectionName?: string): Promise<void>;
}
