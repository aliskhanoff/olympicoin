import { Module } from '@nestjs/common';
import { DatabaseModule } from '@oly/database';
import { AccountsService } from './accounts.service';
@Module({
  imports: [DatabaseModule],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
