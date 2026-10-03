import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MatchesService } from './matches.service';

@Controller()
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  @Post('events/:eventId/generate-matches')
  generate(@Param('eventId') eventId: string, @Body() body: { courtCount: number }) {
    return this.matchesService.generateForEvent(eventId, body.courtCount);
  }

  @Post('matches/:id/score')
  score(
    @Param('id') id: string,
    @Body() body: { submittedBy: string; team1Score: number; team2Score: number },
  ) {
    return this.matchesService.submitScore(id, body.submittedBy, body.team1Score, body.team2Score);
  }

  @Get('events/:eventId/standings')
  standings(@Param('eventId') eventId: string) {
    return this.matchesService.standingsForEvent(eventId);
  }
}
