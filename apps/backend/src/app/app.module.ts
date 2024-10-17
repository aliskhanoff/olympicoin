import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [

    ConfigModule.forRoot({
      envFilePath: [  join(__dirname, '../../../', '.env.local') ],
      isGlobal: false
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../dist', 'static')
    }),
  ],
  controllers: [],
  providers: [DatabaseService],
})
export class AppModule {}
