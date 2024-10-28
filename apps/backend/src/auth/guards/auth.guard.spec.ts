import { Test, type TestingModule } from '@nestjs/testing';
import type { ExecutionContext } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'node:path';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        
        ConfigModule.forRoot({
            envFilePath: [ join(__dirname, '../../../', '.env.local') ],
        }),

        JwtModule.register({
            secret: process.env.JWT_SECRET || 'some_random_secret_like=6487db176a7bf63',
            signOptions: { expiresIn: '1024h' },
        }),

      ]
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    
    authGuard = new AuthGuard(jwtService, configService);

  });

  it('should grant access if token is valid', () => {
    // Mock the token verification
    const payload = { 
        token: "anytoken",
        user: {
            provider: "telegram",
            userId: 6087942455,
            userName:"@IbnKhaleed",
            firstName: "Ramz",
            lastName: "Ali",
            lang: "en"
        }
    };

    jest.spyOn(jwtService, 'verify').mockReturnValue(payload);

    // Create a mock execution context
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer valid-token',
          },
        }),
      }),
    } as ExecutionContext;


    const canActivateResult = authGuard.canActivate(mockExecutionContext);

    expect(canActivateResult).toBeTruthy();
  });

  it('should deny access if token is missing', async () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    } as ExecutionContext;

    expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should deny access if token is invalid', () => {
    
    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer invalid-token',
          },
        }),
      }),
    } as ExecutionContext;

    expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );

  });
});