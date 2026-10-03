import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  list(@Query('clubId') clubId: string) {
    return this.eventsService.listForClub(clubId);
  }

  @Get(':id')
  getEvent(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @Post()
  create(
    @Body()
    body: {
      clubId: string;
      title: string;
      venue: string;
      startsAt: string;
      endsAt: string;
      courtCount: number;
      maxPlayers: number;
      createdBy: string;
    },
  ) {
    return this.eventsService.create({
      ...body,
      startsAt: new Date(body.startsAt),
      endsAt: new Date(body.endsAt),
    });
  }

  @Post(':id/rsvp')
  rsvp(@Param('id') id: string, @Body() body: { userId: string }) {
    return this.eventsService.rsvp(id, body.userId);
  }

  @Post('rsvps/:rsvpId/check-in')
  checkIn(@Param('rsvpId') rsvpId: string) {
    return this.eventsService.checkIn(rsvpId);
  }
}
