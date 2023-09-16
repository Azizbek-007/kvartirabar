import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import TokenPayload from 'common/interfaces/tokenPayload.interface';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: '1234',
    });
  }

  validate(payload: TokenPayload) {
    return payload;
  }
}
