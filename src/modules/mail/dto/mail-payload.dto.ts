export class MailPayload {
    to: string;
    subject: string;
    text?: string;  
    props?: {
        [name: string]: any;
    };
}
