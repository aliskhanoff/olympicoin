import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash, validate } from './password-hasher'

const DEFAULT_ITERATIONS = 100
const DEFAULT_DIGEST = "sha256"
const DEFAULT_KEY_LEN = 12;
const DEFAULT_SAL_TLEN = 12;

@Injectable()
export class PasswordGeneratorService {
  
    private digest: string;
    private iterations: number;
    private keyLen: number;
    private saltLen: number;

    constructor(@Inject(ConfigService) configService: ConfigService) {
        
        this.digest = configService.get<string>('PASSWORD_DIGEST') || DEFAULT_DIGEST;
        this.keyLen = configService.get<number>('PASSWORD_KEY_LEN') || DEFAULT_KEY_LEN;
        this.saltLen = configService.get<number>('PASSWORD_SALT_LEN') || DEFAULT_SAL_TLEN;
        this.iterations = configService.get<number>('PASSWORD_ITERATIONS') || DEFAULT_ITERATIONS;
    }

    hashPassword(password: string): string {
        return hash(password, null, this.digest, this.keyLen,  this.saltLen, this.iterations)
    }

    validatePassword(passwordFromDB: string, providedPassword: string): boolean {
        return validate(passwordFromDB, providedPassword, this.digest, this.keyLen, this.saltLen, this.iterations)
    }

}

