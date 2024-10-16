import { Inject, Injectable } from '@nestjs/common';
import { getDatabaseConnection } from './connection';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class DatabaseService {

    constructor(@Inject(ConfigService) private configService: ConfigService) {}

    public getDatabase<T>() {
        return getDatabaseConnection<T>({
            user: this.configService.get("DATABASE_USER"),
            password: this.configService.get("DATABASE_PASSWORD"),
            host: this.configService.get("DATABASE_HOST"),
            port: this.configService.get<number>("DATABASE_PORT"),
            ssl: this.configService.get("DATABASE_SSL") === "true",
            database: this.configService.get("DATABASE_NAME"),
            max: this.configService.get<number>("DATABASE_MAX_CONNECTIONS") || 32,
            connectionTimeoutMillis: 5000, // 5 seconds timeout for database connections
        })
    }

}
