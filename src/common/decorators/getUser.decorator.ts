import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import TokenPayload from 'common/interfaces/tokenPayload.interface';

export const GetUser = createParamDecorator(async (data: unknown, ctx: ExecutionContext): Promise<TokenPayload> => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});
