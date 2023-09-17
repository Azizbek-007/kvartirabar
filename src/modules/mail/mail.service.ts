import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailPayload } from './dto/mail-payload.dto';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    /**
     * Send an email using the provided MailPayload.
     *
     * @param {MailPayload} inputs - The MailPayload object containing email details.
     * @returns {Promise<void>} - Returns a Promise that resolves when the email is sent successfully.
     */

    sendEmail(inputs: MailPayload): Promise<void> { // Specify the return type as Promise<void>
        return new Promise((resolve, reject) => {
            try {
                this.mailerService.sendMail({
                    to: inputs.to,
                    subject: inputs.subject,
                    html: inputs.html,
                    text: inputs.text,
                    context: inputs.props,
                });

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

}
