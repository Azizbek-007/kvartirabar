export function generateOtpCode(digit = 4): string {
    const digits = '0123456789';
    let otpCode = '';

    for (let i = 0; i < digit; i++) {
        otpCode += digits[Math.floor(Math.random() * 10)];
    }
    return otpCode;
}
