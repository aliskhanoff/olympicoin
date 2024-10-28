import { type CanActivate, type ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(
    @Inject(ConfigService) private configService: ConfigService,
    @Inject(JwtService) private jwtService: JwtService, 
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('Token is missing')

    try {
        const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      request.user = payload.user;
    } 
    
    catch (e) { throw new UnauthorizedException('INVALID_TOKEN'); }
    return true;
  }

  private extractTokenFromHeader(request): string | null {
    const authHeader = request.headers.authorization;
    return authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  }
  
}