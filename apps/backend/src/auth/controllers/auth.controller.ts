import { Body, Controller, HttpCode, HttpException, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../guards/auth.guard';
import type { AccountModel } from '@oly/accounts/types';

@Controller('api/auth')
export class AuthController {

    constructor(@Inject(AuthService) private authService: AuthService) {}

    @Post("telegram")
    @HttpCode(HttpStatus.OK) 
    async login(@Body() loginModel: AccountModel) {
        
        if(!loginModel) throw new HttpException("Invalid request", HttpStatus.BAD_REQUEST)
        if(!loginModel.userId || !loginModel.provider) throw new HttpException("Invalid request", HttpStatus.BAD_REQUEST)
        if(!loginModel.firstName) loginModel.firstName = ""
        

        return await this.authService.authenticate(loginModel);
    }
}
