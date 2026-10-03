import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  // Find-or-create by email. This stands in for a real sign-up flow
  // until a real auth provider (Firebase Auth/Auth0) is wired in —
  // see the Technical Architecture doc §1 and §9.
  @Post()
  async upsert(@Body() body: { fullName: string; email: string }) {
    const existing = await this.usersService.findByEmailOrPhone(body.email);
    if (existing) return existing;
    return this.usersService.create(body);
  }
}
