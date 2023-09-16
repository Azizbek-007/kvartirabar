import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import TokenPayload from 'common/interfaces/tokenPayload.interface';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: '4321',
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
