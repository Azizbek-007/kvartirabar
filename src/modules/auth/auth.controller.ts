import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { MailService } from 'modules/mail/mail.service';
import { EmailDto } from './dto/email.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';
import { AccessTokenGuard, RefreshTokenGuard } from 'common/guards';
import { GetUser } from 'common/decorators/getUser.decorator';
import TokenPayload from 'common/interfaces/tokenPayload.interface';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('/signup')
    public async signUp(@Body() signUpDto: SignUpDto) {
        return await this.authService.signUp(signUpDto);
    }

    @Post('/resend-otp')
    public async resendOtp(@Body() emailDto: EmailDto) {
        return await this.authService.resendOtp(emailDto);
    }

    @Post('/verify-otp')
    public async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        return await this.authService.verifyOtp(verifyOtpDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('/login')
    public async signIn(@Body() loginDto: LoginDto) {
        return await this.authService.signIn(loginDto);
    }

    @UseGuards(AccessTokenGuard)
    @Get('logout')
    public async logout(@GetUser() user: TokenPayload) {
        return await this.authService.logout(user.userId);
    }

    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    public async refreshTokens(@GetUser() user) {
        return await this.authService.refreshTokens(user.userId, user.refreshToken);
    }
}
