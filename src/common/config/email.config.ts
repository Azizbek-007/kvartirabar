import * as NestConfig from '@nestjs/config';

export const MailConfig = NestConfig.registerAs('mail', () => ({
  transport: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || "kvartirabar.official@gmail.com",
      pass: process.env.SMTP_PASSWORD ||"sqox pgiv hydd vfko"
    }
  },
  defaults: {
    from: `KvartiraBar.uz <${process.env.SMTP_USER}>`
  }
}));
