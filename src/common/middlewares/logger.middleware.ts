import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const { ip, method, baseUrl } = req;
        const userAgent = req.get('user-agent') || '';
        const { statusCode } = res;
        const contentLength = res.get('content-length');
        console.info(`${method} ${baseUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`);
        next();
    }
}
