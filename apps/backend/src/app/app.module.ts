import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { AccountsModule } from '@olympicoin/accounts/accounts.module';
import { DatabaseModule } from '@olympicoin/database/database.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
