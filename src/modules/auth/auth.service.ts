import { Injectable, ConflictException, Inject, ForbiddenException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from 'modules/user/user.service';
import { MailService } from 'modules/mail/mail.service';
import { generateOtpCode } from 'common/utils/generate-otp.util';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { EmailDto } from './dto/email.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { TokenService } from 'modules/token/token.service';
import { LoginDto } from './dto/login.dto';
import { comparePasswords } from 'common/utils/password.util';


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly mailService: MailService,
        private readonly tokenService: TokenService,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,

    ) { }


    public async signUp(signUpDto: SignUpDto): Promise<{ ttl: number }> {
        await this.userService.create(signUpDto);
       await this.generateAndSendOtpCode(signUpDto.email);
        return {
            ttl: 300,
        };
    }

    public async resendOtp(emailDto: EmailDto): Promise<{ ttl: number; }> {
        const existOtpCode = await this.cacheManager.get(emailDto.email);
        if (existOtpCode) {
            const getTtl = await this.cacheManager.store.ttl(emailDto.email);
            return {
                ttl: getTtl
            }
        }
        const otpCode = generateOtpCode();
        await this.mailService.sendEmail({
            to: emailDto.email,
            subject: 'verification code',
            text: `<code>${otpCode}</code>`
        });
        await this.cacheManager.set(emailDto.email, otpCode, { ttl: 300 } as any);
        return {
            ttl: 300,
        }
    }

    public async verifyOtp(verifyOtpDto: VerifyOtpDto) {
        const existOtpCode = await this.cacheManager.get(verifyOtpDto.email);
        if (!existOtpCode) {
            throw new ConflictException('otp code is not exist')
        }
        if (existOtpCode !== verifyOtpDto.otp) {
            throw new ConflictException('otp code is not match')
        }
        if (existOtpCode === verifyOtpDto.otp) {
            await this.cacheManager.del(verifyOtpDto.email);
            const user = await this.userService.setUserVerifiedByEmail(verifyOtpDto.email);
            const tokens = await this.tokenService.generateTokens({
                userId: user._id.toString()
            });
            await this.tokenService.saveToken(user._id.toString(), tokens.refreshToken);

            return { user, tokens };
        }
    }

    public async signIn(loginDto: LoginDto) {
        const user = await this.userService.getByEmail(loginDto.email);
        if (!user) {
            throw new ConflictException('email is not exist')
        }
        if (user && !user.isActive) {
            throw new ConflictException('email is not verified')
        }
        if (user && user.isActive && await comparePasswords(loginDto.password, user.password)) {
            const tokens = await this.tokenService.generateTokens({
                userId: user._id.toString()
            });
            await this.tokenService.saveToken(user._id.toString(), tokens.refreshToken);

            return { user, tokens };
        }

    }

    public async logout(userId: string) {
        await this.tokenService.removeToken(userId);
    }

    public async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.userService.getById(userId);
        if (!user || !user.isActive) {
            throw new ForbiddenException('Access Denied');
        }

        const checkRefreshToken = await this.tokenService.validateRefreshToken(refreshToken);
        if (!checkRefreshToken) throw new ForbiddenException('Access Denied');
        const tokens = await this.tokenService.generateTokens({
            userId
        });
        await this.tokenService.saveToken(userId, tokens.refreshToken);
        return tokens;
    }

    private async generateAndSendOtpCode(email: string): Promise<string> {
        const otpCode = generateOtpCode();
        await this.mailService.sendEmail({
            to: email,
            subject: 'verification code',
            text: `<code>${otpCode}</code>`,
        });
        await this.cacheManager.set(email, otpCode, { ttl: 300 } as any);
        return otpCode;
    }
}
