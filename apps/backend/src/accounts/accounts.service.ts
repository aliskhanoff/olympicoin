import { forwardRef, Inject, Injectable, Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'node:path';
import { sql, type InsertResult, type Kysely } from 'kysely';
import type { CreateAccountResponse as CreateAccountModel, Database, FindUserResponse } from './types';
import { type DatabaseMigrator, DatabaseService, createDatabaseMigrator } from '@oly/db';
import { DBQueryHanlder } from '@oly/db';
import { TicketGeneratorService } from '@oly/gen';

@Injectable()
export class AccountsService implements OnModuleInit, OnModuleDestroy {
  private readonly database: Kysely<Database>;
  private readonly loggerService: Logger;
  private readonly migrator: DatabaseMigrator<Database>;
  private readonly queryHandler: DBQueryHanlder;
  private ticketGeneratorService: TicketGeneratorService
  constructor(
    @Inject(ConfigService) private configService: ConfigService,
    @Inject(DatabaseService) databaseService: DatabaseService,
  ) {
    this.loggerService = new Logger("Account Service");
    this.database = databaseService.getDatabase<Database>();
    this.queryHandler = new DBQueryHanlder();
    this.ticketGeneratorService = new TicketGeneratorService(configService);
    this.migrator = createDatabaseMigrator<Database>(
      configService,
      join(__dirname, './migrations'),
    );
  }

  public async createAccount(createAccountModel: CreateAccountModel): Promise<unknown> {
      const result = await this.database.insertInto("accounts").values({
        provider:     createAccountModel.provider,
        user_id:      createAccountModel.userId,
        first_name:   createAccountModel.firstName,
        last_name:    createAccountModel.lastName,
        username:     createAccountModel.userName,
        invite_code:  createAccountModel.inviteCode || this.ticketGeneratorService.generateTicket(),
        lang_id: this.database.selectFrom("languages as lang").where("lang.language_code", "=", createAccountModel.lang || "en").select("lang.id")
    })
    .returning([
        "provider",
        "first_name as firstName", 
        "last_name as lastName", 
        "user_id as userId",
        "username as userName",
        "email",
        "lang_id as lang",
        "invite_code as inviteCode",
      ]).executeTakeFirst()
      .catch(e => this.queryHandler.handleDatabaseError(e))
      
      return result;
  }

  public async findAccount(userName: string): Promise<FindUserResponse | null> {

    const result = await this.database
              .selectFrom("accounts as acc")
                .leftJoin("languages as ln", "acc.lang_id", "ln.id")
                .select([
                  "acc.provider as provider",
                  "acc.id as id",
                  "acc.user_id as userId", 
                  "acc.username as userName", 
                  "acc.first_name as firstName", 
                  "acc.last_name as lastName", 
                  "acc.created_at as createdAt",
                  "acc.updated_at as updatedAt",
                  "language_code as lang",
                  "acc.email as email",
                  "ln.language_code as lang"
                ])
                .where("acc.username", "=", userName)
                .executeTakeFirst()
                .catch(e => this.queryHandler.handleDatabaseError(e))

        return result as FindUserResponse;
  }
    

  async onModuleInit() {
    this.loggerService.warn('Accounts module initialized');
    
    if (this.configService.get<string>('MIGRATE') === 'true') {
      this.loggerService.warn(
        'Migrations are enabled. Disable migrations removing MIGRATE=true from env file',
      );
      this.loggerService.log('Database migration started');
      await this.migrator.migrate();
      this.loggerService.log('Database migration finished');
    }
  }

  async onModuleDestroy() {
    if (this.configService.get<string>('MIGRATE') === 'true') {
      this.loggerService.verbose('Database migrations down...');
      await this.migrator.rollback();
      this.loggerService.verbose('Migration down finished');
    }
  }
}
