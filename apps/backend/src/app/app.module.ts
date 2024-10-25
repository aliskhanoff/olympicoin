import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DatabaseModule } from '@oly/db';

/**
 * Should be import { AccountsModule } from '@oly/acc' but
 * suddenly doesn't work?
 */
import { AccountsModule } from '../accounts/accounts.module'


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [join(__dirname, '../../../', 'apps/backend', '.env.local')],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'frontend'),
    }),
    DatabaseModule,
    AccountsModule,
  ]
})
export class AppModule {}
