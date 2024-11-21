import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';
import * as nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendEmail(
    to: string,
    subject: string,
    name: string,
    text: string,
    buttonText?: string,
    buttonLink?: string,
  ) {
    const transport = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });

    let buttonElement = '';

    if (buttonText && buttonLink) {
      buttonElement = `
        <p style="text-align: start; margin: 20px 5px">
          <a
            href="${buttonLink}"
            style="
              display: inline-block;
              padding: 6px 20px;
              background-color: #097544;
              color: #ffffff;
              text-decoration: none;
              font-size: 14px;
              border-radius: 5px;
            "
          >
            ${buttonText}
          </a>
        </p>
      `;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Email Template</title>
        </head>
        <body
          style="
            margin: 20px 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
          "
        >
          <table
            align="center"
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="600"
            style="
              border-collapse: collapse;
              margin: 20px auto;
              background-color: #ffffff;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            "
          >
            <tr>
              <td
                align="center"
                style="padding: 20px 0; background-color: #097544; color: #ffffff"
              >
                <h1 style="margin: 0; font-size: 24px">${subject}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px; color: #333333; line-height: 1.5">
                <p style="margin: 0 0 10px">Dear ${name},</p>

                <!-- dynamic part -->
                <div>${text}</div>
                <!-- ------ -->
                
                ${buttonElement}
                
                <p style="margin: 0">
                  <strong>Please note:</strong> Do not reply to this email. This
                  email is sent from an unattended mailbox. Replies will not be read.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 20px; background-color: #f1f1f1">
                <p style="margin: 0; color: #333333; font-size: 14px">
                  Best Regards,
                </p>
                <p style="margin: 0; color: #333333; font-size: 12px">
                  ${this.configService.get<string>('COMPANY_NAME')}
                </p>
              </td>
            </tr>
            <tr>
              <td
                align="center"
                style="
                  padding: 10px;
                  background-color: #333333;
                  color: #ffffff;
                  font-size: 12px;
                "
              >
                <p style="margin: 0">
                  &copy; ${new Date().getFullYear()} ${this.configService.get<string>('COMPANY_NAME')}. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const mailOptions: MailOptions = {
      from: this.configService.get<string>('SENDER_EMAIL'),
      to,
      subject,
      html: htmlContent,
    };

    try {
      await transport.sendMail(mailOptions);
      console.log(`Emaiil successfully sent to ${to}`);
    } catch (error) {
      log(error);
    }
  }
}
