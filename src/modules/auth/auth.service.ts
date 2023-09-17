import { Injectable, ConflictException, Inject, ForbiddenException, BadGatewayException, BadRequestException } from '@nestjs/common';
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
        return await this.sendOtpCode(signUpDto.email);
    }

    public async resendOtp(emailDto: EmailDto): Promise<{ ttl: number; }> {
        const user = await this.userService.getByEmail(emailDto.email);
        if (!user) {
            throw new BadRequestException('email is not exist')
        }
        if (user.isActive == true) {
            throw new BadRequestException('email is already verified')
        }
        return await this.sendOtpCode(emailDto.email);
    }

    public async verifyOtp(verifyOtpDto: VerifyOtpDto) {
        const existOtpCode = await this.cacheManager.get(verifyOtpDto.email);
        if (!existOtpCode || existOtpCode !== verifyOtpDto.otp) {
            throw new ConflictException('Invalid OTP code');
        }
        await this.cacheManager.del(verifyOtpDto.email);
        const user = await this.userService.setUserVerifiedByEmail(verifyOtpDto.email);
        const tokens = await this.tokenService.generateTokens({
            userId: user._id.toString(),
        });
        await this.tokenService.saveToken(user._id.toString(), tokens.refreshToken);
        return { user, tokens };
    }

    public async signIn(loginDto: LoginDto) {
        const user = await this.userService.getByEmail(loginDto.email);
        if (!user) {
            throw new BadRequestException('Email not found');
        }
        if (!user.isActive) {
            throw new ForbiddenException('Email is not verified');
        }
        if (!(await comparePasswords(loginDto.password, user.password))) {
            throw new BadRequestException('Invalid email or password');
        }

        const tokens = await this.tokenService.generateTokens({
            userId: user._id.toString(),
        });
        await this.tokenService.saveToken(user._id.toString(), tokens.refreshToken);
        return { user, ...tokens };
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

    public async forgotPassword(email: string) {
        const user = await this.userService.getByEmail(email);
        if (!user) {
            throw new BadGatewayException('email is not exist')
        }
        if (user && !user.isActive) {
            throw new ForbiddenException('email is not verified')
        }
        if (user && user.isActive) {
            return await this.sendOtpCode(email);
        }
    }

    public async resetPassword(resetPasswordDto: VerifyOtpDto) {
        const existOtpCode = await this.cacheManager.get(resetPasswordDto.email);
        if (!existOtpCode || existOtpCode !== resetPasswordDto.otp) {
            throw new ConflictException('Invalid OTP code');
        }
        await this.cacheManager.del(resetPasswordDto.email);
        const user = await this.userService.getByEmail(resetPasswordDto.email);
        const tokens = await this.tokenService.generateTokens({
            userId: user._id.toString(),
        });
        await this.tokenService.saveToken(user._id.toString(), tokens.refreshToken);
        return { user, tokens };
    }

    private async sendOtpCode(email: string) {
        const existOtpCode = await this.cacheManager.get(email);
        if (existOtpCode) {
            const ttl = await this.cacheManager.store.ttl(email);
            return { ttl }
        }
        const otpCode = generateOtpCode();
        await this.mailService.sendEmail({
            to: email,
            subject: 'verification code',
            html: `code: <code>${otpCode}</code>`,
        });
        await this.cacheManager.set(email, otpCode, { ttl: 100 } as any);
        return { ttl: 100 };
    }
}
