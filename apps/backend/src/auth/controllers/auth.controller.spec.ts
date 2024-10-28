import { Test, type TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'node:path';
import { AccountsService } from '@oly/accounts';
import { createDatabaseMigrator, type DatabaseMigrator, DatabaseService } from '@oly/database';
import type { Database } from '@oly/accounts/types';

describe('AuthController', () => {
  let controller: AuthController;
  let migrator: DatabaseMigrator<Database>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: [ join(__dirname, '../../../', '.env.local') ],
        }),
  
        JwtModule.register({
          secret: process.env.JWT_SECRET || 'some_random_secret_like=6487db176a7bf63',
          signOptions: { expiresIn: '1024h' },
        }),
      ],
      controllers: [AuthController],
      providers: [ DatabaseService, AccountsService, AuthService ]
    }).compile();
    
    const configService = module.get<ConfigService>(ConfigService);

    migrator = createDatabaseMigrator<Database>(
      configService,
      join(__dirname, '../../accounts/migrations'),
    )
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login user and return auth token', async () => {

    await migrator.migrate()

      const initialUser = {
        provider: "telegram",
        userId: "123456789",
        userName:"@IbnKhaleed",
        firstName: "Ramz",
        lastName: "Ali",
        lang: "en"
      }

      const result = await controller.login(initialUser)
      
      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();

      expect(result.user.provider).toBe(initialUser.provider);
      expect(result.user.firstName).toBe(initialUser.firstName);
      expect(result.user.lang).toBe(initialUser.lang);

      await migrator.rollback()
  })

});
