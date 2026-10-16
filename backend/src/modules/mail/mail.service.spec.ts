import { describe, it, expect, vi } from 'vitest';
import { MailService } from './mail.service';
import { renderEnquiryEmailHtml, renderEnquiryEmailText } from './templates/enquiry-confirmation.template';
import { renderConsultationEmailHtml, renderConsultationEmailText } from './templates/consultation-confirmation.template';

describe('MailService & Email Templates', () => {
  it('should render enquiry confirmation email with reference code and details', () => {
    const data = {
      referenceNumber: 'ASC-ENQ-123456',
      fullName: 'Rahul Desai',
      email: 'rahul.desai@example.com',
      phone: '+91 8780791723',
      relationshipToParent: 'Son',
      parentLocality: 'Alkapuri',
      parentCity: 'Vadodara',
      parentPincode: '390007',
      parentPreferredName: 'Kiritbhai',
      serviceOfInterest: 'regular-support',
      preferredContactMethod: 'PHONE',
      preferredConsultationDate: '2026-10-20',
      preferredTimeWindow: 'Morning (9:00 AM - 12:00 PM IST)',
      message: 'Need help with weekly check-ins and grocery errands.',
    };

    const html = renderEnquiryEmailHtml(data);
    expect(html).toContain('ASC-ENQ-123456');
    expect(html).toContain('Thank You! Your Enquiry Has Been Received.');
    expect(html).toContain('What Happens Next:');
    expect(html).toContain('Alkapuri, Vadodara - 390007');
    expect(html).toContain('Rahul Desai');
    expect(html).toContain('+91 8780791723');

    const text = renderEnquiryEmailText(data);
    expect(text).toContain('ASC-ENQ-123456');
    expect(text).toContain('Rahul Desai');
  });

  it('should render consultation confirmation email with reference code and details', () => {
    const data = {
      referenceNumber: 'ASC-CON-789012',
      fullName: 'Ananya Patel',
      email: 'ananya.patel@example.com',
      phone: '+91 91234 56789',
      preferredDate: '2026-10-22',
      preferredTimeWindow: 'Evening (3:00 PM - 6:00 PM IST)',
      consultationMethod: 'PHONE',
      supportRequirements: 'Looking for hospital accompaniment for mother.',
    };

    const html = renderConsultationEmailHtml(data);
    expect(html).toContain('ASC-CON-789012');
    expect(html).toContain('Consultation Request Received!');
    expect(html).toContain('Ananya Patel');
    expect(html).toContain('2026-10-22');
    expect(html).toContain('Evening (3:00 PM - 6:00 PM IST)');

    const text = renderConsultationEmailText(data);
    expect(text).toContain('ASC-CON-789012');
    expect(text).toContain('Ananya Patel');
  });

  it('should handle simulated mail sending without crashing', async () => {
    const mockConfig = {
      get: vi.fn().mockImplementation((key: string, def?: any) => {
        if (key === 'PUBLIC_SUPPORT_EMAIL') return 'enquiriesataapnosaathcare@gmail.com';
        if (key === 'PUBLIC_ORG_NAME') return 'AapnoSaath Care';
        return def;
      }),
    } as any;

    const mailService = new MailService(mockConfig);
    // In simulated mode without initTransporter network calls
    const res = await mailService.sendEnquiryConfirmation({
      referenceNumber: 'ASC-ENQ-999999',
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '+91 99999 99999',
      relationshipToParent: 'Daughter',
      parentLocality: 'Gotri',
      serviceOfInterest: 'family-check-in',
    });

    expect(res.success).toBe(true);
    expect(res.mode).toBe('simulated');
  });
});
