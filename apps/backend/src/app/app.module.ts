import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DatabaseModule } from '@oly/database';

/**
 * Should be import { AccountsModule } from '@oly/acc' but
 * suddenly doesn't work?
 */
import { AccountsModule } from '../accounts/accounts.module'
import { AuthModule } from '@oly/auth/auth.module';


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
    AuthModule
  ]
})
export class AppModule {}
