import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import {
  EnquiryEmailData,
  renderEnquiryEmailHtml,
  renderEnquiryEmailText,
} from './templates/enquiry-confirmation.template';
import {
  ConsultationEmailData,
  renderConsultationEmailHtml,
  renderConsultationEmailText,
} from './templates/consultation-confirmation.template';

export interface SendMailResult {
  success: boolean;
  messageId?: string;
  previewUrl?: string;
  error?: string;
  mode: 'smtp' | 'ethereal' | 'simulated';
}

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;
  private mode: 'smtp' | 'ethereal' | 'simulated' = 'simulated';
  private fromAddress = '"AapnoSaath Care" <enquiriesataapnosaathcare@gmail.com>';
  private adminEmail = 'enquiriesataapnosaathcare@gmail.com';

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.initTransporter();
  }

  private async initTransporter(): Promise<void> {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT', 587);
    const smtpSecure = this.configService.get<string>('SMTP_SECURE') === 'true';
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');
    const customFrom = this.configService.get<string>('SMTP_FROM');
    const supportEmail = this.configService.get<string>(
      'PUBLIC_SUPPORT_EMAIL',
      'enquiriesataapnosaathcare@gmail.com',
    );
    const orgName = this.configService.get<string>('PUBLIC_ORG_NAME', 'AapnoSaath Care');

    this.adminEmail = this.configService.get<string>('ADMIN_NOTIFY_EMAIL', supportEmail);
    this.fromAddress = customFrom || `"${orgName}" <${supportEmail}>`;

    // 1. If SMTP credentials are provided (e.g. Free Gmail SMTP with App Password)
    if (smtpUser && smtpPass) {
      try {
        const host = smtpHost || (smtpUser.includes('@gmail.com') ? 'smtp.gmail.com' : 'smtp.gmail.com');
        this.transporter = nodemailer.createTransport({
          host,
          port: Number(smtpPort) || (smtpSecure ? 465 : 587),
          secure: smtpSecure || Number(smtpPort) === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });
        this.mode = 'smtp';
        this.logger.log(`[MailService] Initialized SMTP transporter with host: ${host} (${smtpUser})`);
        return;
      } catch (err: any) {
        this.logger.error(`[MailService] Failed to configure SMTP transporter: ${err?.message}`);
      }
    }

    // 2. Fallback for Zero-Config / Development: Nodemailer Free Ethereal Account
    try {
      this.logger.log('[MailService] No SMTP_USER/SMTP_PASS found. Creating free Ethereal test inbox...');
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      this.mode = 'ethereal';
      this.logger.log(
        `[MailService] Initialized free Ethereal test mailer. Emails can be viewed online via preview URLs.`,
      );
    } catch (err: any) {
      this.mode = 'simulated';
      this.logger.warn(
        `[MailService] Could not reach Ethereal (${err?.message}). Running in safe simulation mode (logs only).`,
      );
    }
  }

  /**
   * Triggers enquiry confirmation email to user and copy/notification to support desk
   */
  async sendEnquiryConfirmation(data: EnquiryEmailData): Promise<SendMailResult> {
    const subject = `Enquiry Received: Ref #${data.referenceNumber} - AapnoSaath Care Vadodara`;
    const html = renderEnquiryEmailHtml(data);
    const text = renderEnquiryEmailText(data);

    return this.sendMail({
      to: data.email,
      subject,
      html,
      text,
      referenceNumber: data.referenceNumber,
      notifyAdmin: true,
      adminSubject: `[NEW ENQUIRY] Ref #${data.referenceNumber} - ${data.fullName} (${data.parentLocality})`,
    });
  }

  /**
   * Triggers consultation request confirmation email to user and copy/notification to support desk
   */
  async sendConsultationConfirmation(data: ConsultationEmailData): Promise<SendMailResult> {
    const subject = `Consultation Request Received: Ref #${data.referenceNumber} - AapnoSaath Care Vadodara`;
    const html = renderConsultationEmailHtml(data);
    const text = renderConsultationEmailText(data);

    return this.sendMail({
      to: data.email,
      subject,
      html,
      text,
      referenceNumber: data.referenceNumber,
      notifyAdmin: true,
      adminSubject: `[NEW CONSULTATION] Ref #${data.referenceNumber} - ${data.fullName} (${data.preferredDate} ${data.preferredTimeWindow})`,
    });
  }

  /**
   * Internal sender with error containment and preview URL logging
   */
  private async sendMail(options: {
    to: string;
    subject: string;
    html: string;
    text: string;
    referenceNumber: string;
    notifyAdmin?: boolean;
    adminSubject?: string;
  }): Promise<SendMailResult> {
    try {
      if (this.transporter && this.mode !== 'simulated') {
        const info = await this.transporter.sendMail({
          from: this.fromAddress,
          to: options.to,
          subject: options.subject,
          text: options.text,
          html: options.html,
        });

        let previewUrl: string | undefined;
        if (this.mode === 'ethereal') {
          previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
          this.logger.log(`\n======================================================`);
          this.logger.log(`[MailService] EMAIL TRIGGERED SUCCESSFULLY (Ref #${options.referenceNumber})`);
          this.logger.log(`Recipient: ${options.to}`);
          this.logger.log(`Subject: ${options.subject}`);
          if (previewUrl) {
            this.logger.log(`Free Web Preview URL: ${previewUrl}`);
          }
          this.logger.log(`======================================================\n`);
        } else {
          this.logger.log(
            `[MailService] Real Email Sent via SMTP to ${options.to} (MessageId: ${info.messageId}) for Ref #${options.referenceNumber}`,
          );
        }

        // Send alert to coordination desk if configured and recipient is different
        if (
          options.notifyAdmin &&
          this.adminEmail &&
          this.adminEmail.toLowerCase() !== options.to.toLowerCase()
        ) {
          try {
            await this.transporter.sendMail({
              from: this.fromAddress,
              to: this.adminEmail,
              subject: options.adminSubject || `[NOTIFICATION] ${options.subject}`,
              text: `A new submission was received on AapnoSaath Care website.\n\n` + options.text,
              html: options.html,
            });
            this.logger.log(`[MailService] Notification sent to coordination desk: ${this.adminEmail}`);
          } catch (adminErr: any) {
            this.logger.warn(`[MailService] Failed to send admin notification: ${adminErr?.message}`);
          }
        }

        return {
          success: true,
          messageId: info.messageId,
          previewUrl,
          mode: this.mode,
        };
      }

      // Simulated mode (fallback when offline or credentials missing)
      this.logger.log(`\n======================================================`);
      this.logger.log(`[MailService] [SIMULATED EMAIL TRIGGERED] (Ref #${options.referenceNumber})`);
      this.logger.log(`To: ${options.to}`);
      this.logger.log(`Subject: ${options.subject}`);
      this.logger.log(`======================================================\n`);

      return {
        success: true,
        mode: 'simulated',
      };
    } catch (err: any) {
      this.logger.error(
        `[MailService] Error sending email to ${options.to} for Ref #${options.referenceNumber}: ${err?.message}`,
        err?.stack,
      );
      return {
        success: false,
        error: err?.message,
        mode: this.mode,
      };
    }
  }

  getMode(): string {
    return this.mode;
  }
}
