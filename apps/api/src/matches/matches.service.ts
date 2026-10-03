import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { generateSinglesRoundRobin } from './round-robin.util';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async generateForEvent(eventId: string, courtCount: number) {
    const approvedRsvps = await this.prisma.eventRsvp.findMany({
      where: { eventId, status: 'approved' },
    });
    const players = approvedRsvps.map((r) => ({
      userId: r.userId ?? undefined,
      reserveName: r.reserveName ?? undefined,
    }));

    const generated = generateSinglesRoundRobin(players, courtCount);

    return this.prisma.$transaction(
      generated.map((m) =>
        this.prisma.match.create({
          data: {
            eventId,
            roundNumber: m.roundNumber,
            courtNumber: m.courtNumber,
            format: 'singles',
            status: 'pending',
            participants: {
              create: [
                ...m.team1.map((p) => ({ userId: p.userId, reserveName: p.reserveName, team: 1 })),
                ...m.team2.map((p) => ({ userId: p.userId, reserveName: p.reserveName, team: 2 })),
              ],
            },
          },
        }),
      ),
    );
  }

  async submitScore(matchId: string, submittedBy: string, team1Score: number, team2Score: number) {
    const match = await this.prisma.match.findUnique({ where: { id: matchId } });
    if (!match) throw new NotFoundException('Match not found');

    const score = await this.prisma.matchScore.create({
      data: { matchId, team1Score, team2Score, submittedById: submittedBy },
    });
    await this.prisma.match.update({ where: { id: matchId }, data: { status: 'completed' } });
    return score;
  }

  // Standings: wins/losses/point differential per player for an event.
  async standingsForEvent(eventId: string) {
    const matches = await this.prisma.match.findMany({
      where: { eventId },
      include: { participants: true, scores: true },
    });

    const table: Record<string, { wins: number; losses: number; pointDiff: number }> = {};
    const key = (userId?: string | null, reserveName?: string | null) => userId ?? `reserve:${reserveName}`;

    for (const match of matches) {
      const latestScore = match.scores[match.scores.length - 1];
      if (!latestScore) continue;
      const team1 = match.participants.filter((p) => p.team === 1);
      const team2 = match.participants.filter((p) => p.team === 2);
      const diff = latestScore.team1Score - latestScore.team2Score;

      for (const p of team1) {
        const k = key(p.userId, p.reserveName);
        table[k] ??= { wins: 0, losses: 0, pointDiff: 0 };
        table[k].pointDiff += diff;
        if (diff > 0) table[k].wins++;
        else if (diff < 0) table[k].losses++;
      }
      for (const p of team2) {
        const k = key(p.userId, p.reserveName);
        table[k] ??= { wins: 0, losses: 0, pointDiff: 0 };
        table[k].pointDiff -= diff;
        if (diff < 0) table[k].wins++;
        else if (diff > 0) table[k].losses++;
      }
    }
    return table;
  }
}
