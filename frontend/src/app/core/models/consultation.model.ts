export interface ConsultationSubmissionDto {
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTimeWindow: string;
  consultationMethod?: 'PHONE' | 'VIDEO_CALL' | 'WHATSAPP_CALL';
  supportRequirements?: string;
  botHoneypot?: string;
}

export interface ConsultationResponse {
  success: boolean;
  referenceNumber: string;
  message: string;
  status: string;
  createdAt: string;
}
