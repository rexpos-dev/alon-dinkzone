import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  listForClub(clubId: string) {
    return this.prisma.event.findMany({ where: { clubId }, orderBy: { startsAt: 'asc' } });
  }

  findById(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
      include: {
        club: true,
        rsvps: { include: { user: true }, orderBy: { respondedAt: 'asc' } },
        matches: {
          include: { participants: { include: { user: true } }, scores: true },
          orderBy: [{ roundNumber: 'asc' }, { courtNumber: 'asc' }],
        },
      },
    });
  }

  create(data: {
    clubId: string;
    title: string;
    venue: string;
    startsAt: Date;
    endsAt: Date;
    courtCount: number;
    maxPlayers: number;
    createdBy: string;
    recurrenceRule?: string;
  }) {
    return this.prisma.event.create({ data });
  }

  // RSVP: approves automatically if under maxPlayers, else waitlists.
  // Accepts either a real userId or a reserveName (non-app-user placeholder).
  async rsvp(eventId: string, opts: { userId?: string; reserveName?: string }) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { rsvps: true },
    });
    if (!event) throw new NotFoundException('Event not found');

    const activeCount = event.rsvps.filter((r) =>
      ['approved', 'checked_in'].includes(r.status),
    ).length;
    const status = activeCount < event.maxPlayers ? 'approved' : 'waitlisted';
    const waitlistPosition =
      status === 'waitlisted'
        ? event.rsvps.filter((r) => r.status === 'waitlisted').length + 1
        : null;

    return this.prisma.eventRsvp.create({
      data: {
        eventId,
        userId: opts.userId,
        reserveName: opts.reserveName,
        status,
        waitlistPosition,
      },
    });
  }

  // Promotes the next waitlisted RSVP to approved (called when someone cancels).
  async promoteNextWaitlisted(eventId: string) {
    const next = await this.prisma.eventRsvp.findFirst({
      where: { eventId, status: 'waitlisted' },
      orderBy: { waitlistPosition: 'asc' },
    });
    if (!next) return null;
    return this.prisma.eventRsvp.update({
      where: { id: next.id },
      data: { status: 'approved', waitlistPosition: null },
    });
  }

  checkIn(rsvpId: string) {
    return this.prisma.eventRsvp.update({
      where: { id: rsvpId },
      data: { status: 'checked_in' },
    });
  }

  markPaid(rsvpId: string, paid: boolean) {
    return this.prisma.eventRsvp.update({
      where: { id: rsvpId },
      data: { paid },
    });
  }

  async cancelRsvp(rsvpId: string) {
    const rsvp = await this.prisma.eventRsvp.update({
      where: { id: rsvpId },
      data: { status: 'cancelled' },
    });
    // Freed a spot — promote whoever's been waiting longest, if anyone.
    await this.promoteNextWaitlisted(rsvp.eventId);
    return rsvp;
  }
}
