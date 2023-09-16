import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { TokenType } from 'common/enums';
import TokenPayload from 'common/interfaces/tokenPayload.interface';
import { TokenDocument } from 'core/schemas';
import { Model } from 'mongoose';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectModel('Token') private tokenModel: Model<TokenDocument>
    ) { }

    public async generateTokens(payload: TokenPayload) {
        const [accessToken, refreshToken] = await Promise.all([
            await this.jwtService.signAsync(payload, {
                secret: '1234',
                expiresIn: '15m'
            }),
            await this.jwtService.signAsync(payload, {
                secret: '4321',
                expiresIn: '7d'
            }),
        ])
        return {
            accessToken,
            refreshToken
        }
    }

    public async validateAccessToken(token: string) {
        try {
            const userData = await this.jwtService.verifyAsync(token, {
                secret: '1234'
            })
            return userData;
        } catch (e) {
            return null;
        }
    }

    public async validateRefreshToken(token: string) {
        try {
            const userData = await this.jwtService.verifyAsync(token, {
                secret: '4321'
            });
            return userData;
        } catch (e) {
            return null;
        }
    }

    public async saveToken(userId: string, refreshToken: string) {
        const tokenData = await this.tokenModel.findOne({ user: userId })
        if (tokenData) {
            return await this.tokenModel.updateOne({ user: userId }, { $set: { token: refreshToken, type: TokenType.RefreshToken } });
        }
        const token = await this.tokenModel.create({ user: userId, token: refreshToken, type: TokenType.RefreshToken  })
        return token;
    }

    public async removeToken(refreshToken: string) {
        const tokenData = await this.tokenModel.deleteOne({ refreshToken })
        return tokenData;
    }

    public async findToken(refreshToken: string) {
        const tokenData = await this.tokenModel.findOne({ refreshToken })
        return tokenData;
    }
}
