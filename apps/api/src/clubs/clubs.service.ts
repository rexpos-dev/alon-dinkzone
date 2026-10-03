import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class ClubsService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.club.findMany();
  }

  findById(id: string) {
    return this.prisma.club.findUnique({
      where: { id },
      include: { members: true },
    });
  }

  create(ownerId: string, data: { name: string; description?: string; privacy?: 'public' | 'invite_only' }) {
    const joinCode = randomBytes(4).toString('hex').toUpperCase();
    return this.prisma.club.create({
      data: {
        ownerId,
        name: data.name,
        description: data.description,
        privacy: data.privacy ?? 'public',
        joinCode,
        members: {
          create: { userId: ownerId, role: 'owner' },
        },
      },
    });
  }

  async joinByCode(userId: string, joinCode: string) {
    const club = await this.prisma.club.findUnique({ where: { joinCode } });
    if (!club) return null;
    return this.prisma.clubMember.create({
      data: { clubId: club.id, userId, role: 'member' },
    });
  }

  members(clubId: string) {
    return this.prisma.clubMember.findMany({ where: { clubId }, include: { user: true } });
  }
}
