export class MailPayload {
    to: string;
    subject: string;
    html?: string;
    text?: string;  
    props?: {
        [name: string]: any;
    };
}
