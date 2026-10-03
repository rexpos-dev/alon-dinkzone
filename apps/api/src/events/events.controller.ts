import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller()
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get('events')
  list(@Query('clubId') clubId: string) {
    return this.eventsService.listForClub(clubId);
  }

  @Get('events/:id')
  getEvent(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @Post('events')
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

  @Post('events/:id/rsvp')
  rsvp(@Param('id') id: string, @Body() body: { userId?: string; reserveName?: string }) {
    return this.eventsService.rsvp(id, body);
  }

  @Post('events/rsvps/:rsvpId/check-in')
  checkIn(@Param('rsvpId') rsvpId: string) {
    return this.eventsService.checkIn(rsvpId);
  }

  @Post('events/rsvps/:rsvpId/paid')
  markPaid(@Param('rsvpId') rsvpId: string, @Body() body: { paid: boolean }) {
    return this.eventsService.markPaid(rsvpId, body.paid);
  }

  @Post('events/rsvps/:rsvpId/cancel')
  cancel(@Param('rsvpId') rsvpId: string) {
    return this.eventsService.cancelRsvp(rsvpId);
  }
}
