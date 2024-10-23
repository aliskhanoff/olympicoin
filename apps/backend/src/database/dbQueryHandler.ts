import { Logger, NotFoundException } from "@nestjs/common";
import { DatabaseException, ForeignKeyViolationException, type KyselyError, type PostgresError, PostgresErrorCodes, UniqueConstraintViolationException } from "./types";


export class DBQueryHanlder {
    private readonly logger = new Logger(DBQueryHanlder.name);

    handleDatabaseError(error: PostgresError | KyselyError): never {
    
        if ((error as PostgresError).code) {
          const pgError = error as PostgresError;
    
          switch (pgError.code) {
            case PostgresErrorCodes.UNIQUE_VIOLATION:
              throw new UniqueConstraintViolationException(pgError.detail);
            case PostgresErrorCodes.FOREIGN_KEY_VIOLATION:
              throw new ForeignKeyViolationException(pgError.detail);
            case PostgresErrorCodes.NOT_FOUND:
              throw new NotFoundException(pgError.message);
            default:
              throw new DatabaseException(pgError.message);
          }
        }
  
        if ((error as KyselyError).sql) {
          this.logger.error(`SQL Query Error:${error}`, );
          throw new DatabaseException('SQL query error');
        }
    
        this.logger.fatal('SQL Query Error:', (error as KyselyError).sql);
        throw new DatabaseException('Unknown database error');
    }

    }