import * as path from 'node:path';
import { Pool } from 'pg';
import { promises as fs } from 'node:fs';
import {
  Migrator,
  FileMigrationProvider,
  PostgresDialect,
  Kysely,
  type MigrationResult,
} from 'kysely';
import type { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

export function createDatabaseMigrator<T>(
  configService: ConfigService,
  migrationFolder: string,
):DatabaseMigrator<T> {
  return new DatabaseMigrator<T>(configService, migrationFolder);
}

export class DatabaseMigrator<T> {
  private migrator: Migrator;
  private logger: Logger;

  constructor(
    configService: ConfigService,
    migrationFolder: string,
    logger: Logger = new Logger(),
  ) {
    this.migrator = createDbMigrator<T>(configService, migrationFolder);
    this.logger = logger;
  }

  async migrate(): Promise<void> {
    const { error, results } = await this.migrator.migrateToLatest();

    if (error) {
      this.logger.fatal('failed to migrate', error);
      return;
    }

    await handleResults(results, this.logger);
  }

  async rollback(): Promise<void> {
    const { error, results } = await this.migrator.migrateDown();

    if (error) {
      this.logger.fatal('failed to migrate', error);
      return;
    }

    await handleResults(results, this.logger);
  }
}

function createDbMigrator<T>(
  configService: ConfigService,
  migrationFolder: string,
): Migrator {
  return new Migrator({
    db: createConnector<T>(configService),
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder,
    }),
  });
}

function createConnector<T>(configService: ConfigService) {
  return new Kysely<T>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: configService.get<string>('DATABASE_HOST'),
        database: configService.get<string>('DATABASE_NAME'),
        port: configService.get<number>('DATABASE_PORT'),
        user: configService.get<number>('DATABASE_USER'),
        password: configService.get<number>('DATABASE_PASSWORD'),
        ssl: configService.get<string>('DATABASE_SSL') === 'true',
      }),
    }),
  });
}

function handleResults(results: MigrationResult[], logger: Logger) {
  // biome-ignore lint/complexity/noForEach: <explanation>
  results?.forEach((it: MigrationResult) => {
    
    if (it.status === 'Success') {
      logger.verbose(
        `migration "${it.migrationName}" was executed successfully`,
      );
    } 
    
    else if (it.status === 'Error') {
      logger.error(`failed to execute migration "${it.migrationName}"`);
    }

    else if (it.status === 'NotExecuted') {
      logger.error(`Migration has not been executed! "${it.migrationName}"`);
    }

    else {
      logger.error(`unknown status for migration "${it.migrationName}": ${it.status}`);
    }
  });
}
