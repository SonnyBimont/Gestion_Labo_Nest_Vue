// src/auth/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET_DE_LABORATOIRE_2026',
    });
  }

  async validate(payload: any) {
    // Ce qui est retourné ici sera disponible dans req.user
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}
