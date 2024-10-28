import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AccountsModule } from '@oly/accounts';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { AuthGuard } from './guards/auth.guard';
import { ConfigModule } from '@nestjs/config';
import { join } from 'node:path';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'some_random_secret_like=6487db176a7bf63',
      signOptions: { expiresIn: '1024h' },
    }),

    AccountsModule,
    
  ],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],

})
export class AuthModule {
    
}
