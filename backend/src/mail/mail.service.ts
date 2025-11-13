import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import * as ejs from 'ejs';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class MailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendEmailVerification(to: string, verifyUrl: string) {
    const templatePath = path.join(__dirname, 'templates', 'confirm-email.ejs');
    const template = fs.readFileSync(templatePath, 'utf8');

    console.log('from: ', process.env.RESEND_EMAIL);

    const html = ejs.render(template, {
      verifyUrl,
      year: new Date().getFullYear(),
    });

    await this.resend.emails.send({
      from: `Edutrack <${process.env.RESEND_EMAIL}>`,
      to,
      subject: 'Confirm your email address 🎓',
      html,
    });
  }

  async sendPasswordResetEmail(to: string, resetUrl: string) {
    const templatePath = path.join(
      __dirname,
      'templates',
      'reset-password.ejs',
    );
    const template = fs.readFileSync(templatePath, 'utf-8');

    const html = ejs.render(template, {
      resetUrl,
      expiresIn: '15 minutes',
      year: new Date().getFullYear(),
    });

    await this.resend.emails.send({
      from: `Edutrack <${process.env.RESEND_EMAIL}>`,
      to,
      subject: 'Reset your password 🔒',
      html,
    });
  }
}
