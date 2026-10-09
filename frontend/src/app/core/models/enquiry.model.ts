export interface EnquirySubmissionDto {
  fullName: string;
  email: string;
  phone: string;
  relationshipToParent: string;
  parentCity?: string;
  parentLocality: string;
  parentPincode?: string;
  parentPreferredName?: string;
  serviceOfInterest: string;
  preferredContactMethod?: 'PHONE' | 'EMAIL' | 'WHATSAPP';
  preferredConsultationDate?: string;
  preferredTimeWindow?: string;
  message?: string;
  contactConsent: boolean;
  privacyNoticeVersion?: string;
  botHoneypot?: string;
}

export interface EnquiryResponse {
  success: boolean;
  referenceNumber: string;
  message: string;
  status: string;
  createdAt: string;
}
