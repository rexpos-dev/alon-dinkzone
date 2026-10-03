import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

/**
 * Stub auth service. Phase 1 wires this to a real identity provider
 * (Firebase Auth or Auth0 — see Technical Architecture doc §1) for
 * phone/email signup, login, and verification. This stub issues a
 * JWT for an existing user so the rest of the API can be built and
 * tested against a real auth contract from day one.
 */
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async login(identifier: string) {
    const user = await this.usersService.findByEmailOrPhone(identifier);
    if (!user) throw new UnauthorizedException('No account found for that email/phone');
    const token = await this.jwtService.signAsync({ sub: user.id });
    return { accessToken: token, user };
  }
}
