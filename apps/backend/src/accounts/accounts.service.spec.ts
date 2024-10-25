import { join } from 'node:path';
import { Test, type TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from '@olympicoin/database';
import { AccountsService } from './accounts.service';
import { generateInviteTicket } from '../generators';

BigInt.prototype.toJSON = function () {
  return this.toString()
}

describe('AccountsService', () => {
  let service: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
        envFilePath: [ join(__dirname, '../../../', '.env.local') ],
      }),],
      providers: [DatabaseService, AccountsService],
    }).compile();

    service = module.get<AccountsService>(AccountsService);

    await service.onModuleDestroy()
    await service.onModuleInit()
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should create an account", async () => {
      
      const generatedUserName = crypto.randomUUID().split('-').pop();
      const generatedUserID = crypto.randomUUID().split('-').pop();
      const inviteCode = generateInviteTicket()

      const result = await service.createAccount({
        provider: "telegram",
        firstName: generatedUserName,
        lastName: "Khan",
        userId: generatedUserID,
        userName: generatedUserName,
        lang: "en",
        inviteCode
      })

      const expected = {
        email: null,
        provider: "telegram",
        firstName: generatedUserName,
        lastName: "Khan",
        userId: generatedUserID,
        userName: generatedUserName,
        inviteCode,
        lang: 1
      }

      expect(result).toEqual(expected)
  }, 100000)

  it("should return a user", async () => {
    const generatedUserName = crypto.randomUUID().split('-').pop();
    const generatedUserID = crypto.randomUUID().split('-').pop();
    const inviteCode = generateInviteTicket()

    await service.createAccount({
      provider: "telegram",
      firstName: generatedUserName,
      lastName: "Khan",
      userId: generatedUserID,
      userName: generatedUserName,
      lang: "en",
      inviteCode
    });

    const returnedUserFromDB = await service.findAccount(generatedUserName);
    const expectedUserFromDB = {
      provider: "telegram",
      id: returnedUserFromDB.id, 
      userId: generatedUserID, 
      userName: generatedUserName, 
      firstName: generatedUserName, 
      lastName: "Khan", 
      lang: "en",
      email: null,
    }

    expect({
      provider: "telegram",
      id: returnedUserFromDB.id, 
      userId: generatedUserID,
      userName: generatedUserName,
      firstName: generatedUserName,
      lastName: returnedUserFromDB.lastName,
      lang: returnedUserFromDB.lang,
      email: returnedUserFromDB.email,
    }).toEqual(expectedUserFromDB)
  }, 100000)

  afterAll(async () => {
      await service.onModuleDestroy()
  })

})