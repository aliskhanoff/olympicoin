import { Module } from '@nestjs/common';
import  { PasswordGeneratorService, TicketGeneratorService } from '.';

/**
 * Error: circular dependency inside module
 * Find out how to solve the circular dependency
 */
@Module({
  providers:[
      //PasswordGeneratorService, 
      //TicketGeneratorService
  ],
  
  exports: [
    //PasswordGeneratorService, 
    //TicketGeneratorService
  ]

})
export class  GeneratorModule {}
