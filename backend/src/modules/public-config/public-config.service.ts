import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface PublicConfigResponse {
  orgName: string;
  tagline: string;
  supportingMessage: string;
  serviceCity: string;
  serviceState: string;
  serviceCountry: string;
  supportEmail: string;
  supportPhone: string;
  privacyNoticeVersion: string;
  termsVersion: string;
  isPilotPricing: boolean;
  disclaimer: string;
}

@Injectable()
export class PublicConfigService {
  constructor(private readonly configService: ConfigService) {}

  getPublicConfig(): PublicConfigResponse {
    return {
      orgName: this.configService.get<string>('PUBLIC_ORG_NAME', 'AapnoSaath Care'),
      tagline: 'Close to Your Parents. Wherever You Are.',
      supportingMessage: 'A Trusted Friend for Your Parents.',
      serviceCity: this.configService.get<string>('PUBLIC_SERVICE_CITY', 'Vadodara'),
      serviceState: this.configService.get<string>('PUBLIC_SERVICE_STATE', 'Gujarat'),
      serviceCountry: this.configService.get<string>('PUBLIC_SERVICE_COUNTRY', 'India'),
      supportEmail: this.configService.get<string>(
        'PUBLIC_SUPPORT_EMAIL',
        'enquiries@aapnosaathcare.example.com',
      ),
      supportPhone: this.configService.get<string>(
        'PUBLIC_SUPPORT_PHONE',
        '+91 98765 43210',
      ),
      privacyNoticeVersion: this.configService.get<string>(
        'PUBLIC_PRIVACY_VERSION',
        'v1.0',
      ),
      termsVersion: this.configService.get<string>('PUBLIC_TERMS_VERSION', 'v1.0'),
      isPilotPricing: true,
      disclaimer:
        'AapnoSaath Care provides non-medical elder care support and family coordination. We do not provide clinical, medical, nursing, continuous monitoring, or emergency response services.',
    };
  }
}
