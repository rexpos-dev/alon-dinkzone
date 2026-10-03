import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ClubsService } from './clubs.service';

@Controller('clubs')
export class ClubsController {
  constructor(private clubsService: ClubsService) {}

  @Get()
  list() {
    return this.clubsService.list();
  }

  @Get(':id')
  getClub(@Param('id') id: string) {
    return this.clubsService.findById(id);
  }

  @Get(':id/members')
  getMembers(@Param('id') id: string) {
    return this.clubsService.members(id);
  }

  @Post()
  create(@Body() body: { ownerId: string; name: string; description?: string }) {
    return this.clubsService.create(body.ownerId, body);
  }

  @Post(':id/join')
  join(@Param('id') _id: string, @Body() body: { userId: string; joinCode: string }) {
    return this.clubsService.joinByCode(body.userId, body.joinCode);
  }
}
