import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountsService } from '@oly/accounts';
import { JwtService } from '@nestjs/jwt';

export type AuthUserModel = CreateAccountModel;

@Injectable()
export class AuthService {

    private logger: Logger

    constructor(
        // @Inject(ConfigService) private configService: ConfigService,
        @Inject(AccountsService) private accountsService: AccountsService,
        @Inject(JwtService) private jwtService: JwtService 
    ) {
        this.logger = new Logger(AuthService.name)
    }

    async authenticate(userData: UserData) {

        let user = await this.accountsService.findAccount(userData.userName);

        if (!user) { 
            await this.accountsService.createAccount({
                provider: userData.provider,
                userId: userData.userId,
                userName: userData.userName,
                firstName: userData.firstName,
                lastName: userData.lastName,
                lang: userData.lang,
                inviteCode: userData.inviteCode || null,
            });
            user = await this.accountsService.findAccount(userData.userName);
        }

        const payload = { 
            userId: user.userId, 
            username: user.userName,
            lang: user.lang,
            firstName: user.firstName, 
            lastName: user.lastName,
            hasEmail: user.email !== null,
            hasPassword: user.password !== null,
            password: user.password != null
        };

        const token = this.jwtService.sign(payload);

    return { token, user };
  }
}