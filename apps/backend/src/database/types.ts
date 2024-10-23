import { HttpException, HttpStatus } from "@nestjs/common";
import { Injectable, Logger } from '@nestjs/common';

export enum PostgresErrorCodes {
    UNIQUE_VIOLATION = '23505',
    FOREIGN_KEY_VIOLATION = '23503',
    NOT_FOUND = '42P01',
}

export interface PostgresError extends Error {
    code: string;
    detail?: string;
    schema?: string;
    table?: string;
    constraint?: string;
  }
  
export interface KyselyError extends Error {
    sql?: string;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    parameters?: any[];
  }


export class UniqueConstraintViolationException extends HttpException {
    constructor(message = 'Unique constraint violation') {
      super(message, HttpStatus.CONFLICT);
    }
  }
  
  export class ForeignKeyViolationException extends HttpException {
    constructor(message = 'Foreign key violation') {
      super(message, HttpStatus.BAD_REQUEST);
    }
  }
  
  export class NotFoundException extends HttpException {
    constructor(message = 'Resource not found') {
      super(message, HttpStatus.NOT_FOUND);
    }
  }
  
  export class DatabaseException extends HttpException {
    constructor(message = 'Database error') {
      super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }