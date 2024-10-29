import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { generateInviteTicket } from './invite-ticket';

@Injectable()
export class TicketGeneratorService {

    private ticketLen = 6;

    constructor(@Inject(ConfigService) configService: ConfigService) {
       this.ticketLen = configService.get<number>("TICKET_LEN");
    }

    generateTicket(ticketLen: number = null) {
        return generateInviteTicket(ticketLen || this.ticketLen);
    }
}

