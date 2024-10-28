import { Test, type TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AccountsService } from '@oly/accounts';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'node:path';
import { JwtModule } from '@nestjs/jwt';
import { createDatabaseMigrator, type DatabaseMigrator, DatabaseService } from '@oly/database';
import type { Database } from '@oly/accounts/types';

describe('AuthService', () => {
  let service: AuthService;
  let accountService: AccountsService;
  let configService: ConfigService;
  let migrator: DatabaseMigrator<Database>;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      
      imports:  [
        ConfigModule.forRoot({
        envFilePath: [ join(__dirname, '../../../', '.env.local') ],
      }),

      JwtModule.register({
        secret: process.env.JWT_SECRET || 'some_random_secret_like=6487db176a7bf63',
        signOptions: { expiresIn: '1024h' },
      }),
    ],
      providers: [DatabaseService, AccountsService, AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
    accountService = new AccountsService(configService, new DatabaseService(configService));

    migrator = createDatabaseMigrator<Database>(
      configService,
      join(__dirname, '../../accounts/migrations'),
    )

    await migrator.migrate();

  });

  it('all services should be defined', () => {
    expect(service).toBeDefined();
    expect(accountService).toBeDefined();
    expect(migrator).toBeDefined();

  });
  
  it('should authenticate user', async () => {

    const result = await service.authenticate({ 
      provider: "telegram",
      userName: 'test',
      userId: "1234567",
      lang: "en"
    })

    expect(result).not.toBeNull();
    console.error(result)
  })

  afterAll(async () => {
    await migrator.rollback()
  })

});