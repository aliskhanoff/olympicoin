import * as path from 'node:path'
import { Pool } from 'pg'
import { promises as fs } from 'node:fs'
import {
  Migrator,
  FileMigrationProvider,
  PostgresDialect,
  Kysely,
  type MigrationResult,
} from 'kysely'
import type { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'

export function createDatabaseMigrator<T>(configService: ConfigService, migrationFolder: string) {
  return new DatabaseMigrator<T>(configService, migrationFolder)
}

export class DatabaseMigrator<T> {
  
  private migrator: Migrator
  private logger: Logger

  constructor(
    configService: ConfigService, 
    migrationFolder: string, 
    logger: Logger = new Logger)  {
      this.migrator = createDbMigrator<T>(configService, migrationFolder);
      this.logger = logger;
  }

  async migrate () {
    const { error, results } = await this.migrator.migrateToLatest()
    
    if (error) {
      this.logger.fatal('failed to migrate', error)
      return;
    }

    await handleResults(results, this.logger)

  }

  async rollback () {
    const { error, results } = await this.migrator.migrateDown()
      
    if (error) {
      this.logger.fatal('failed to migrate', error)
      return;
    }

    await handleResults(results, this.logger)
  }
   
}

function createDbMigrator<T>(configService: ConfigService, migrationFolder: string ): Migrator {
    return new Migrator({
        db: createConnector<T>(configService),
        provider: new FileMigrationProvider({
          fs,
          path,
          migrationFolder
        }),
      })
}

function createConnector<T> (configService: ConfigService) {
    return new Kysely<T>({
        dialect: new PostgresDialect({
          pool: new Pool({
            host:     configService.get<string>("DATABASE_HOST"),
            database: configService.get<string>("DATABASE_NAME"),
            port:     configService.get<number>("DATABASE_PORT"),
            user:     configService.get<number>("DATABASE_USER"),
            password: configService.get<number>("DATABASE_PASSWORD"),
            ssl:      configService.get<string>("DATABASE_SSL") === "true",
          }),
        }),
      })    
}

function handleResults(results: MigrationResult[], logger: Logger) { 

    // biome-ignore lint/complexity/noForEach: <explanation>
      results?.forEach((it) => {
      if (it.status === 'Success') {
         logger.verbose(`migration "${it.migrationName}" was executed successfully`)
      } 
      
      else if (it.status === 'Error') {
         logger.error(`failed to execute migration "${it.migrationName}"`)
      }
    })
}