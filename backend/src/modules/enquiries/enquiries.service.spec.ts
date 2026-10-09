import { describe, it, expect, vi } from 'vitest';
import { EnquiriesService } from './enquiries.service';
import { EnquiryStatus } from '../../database/entities/enquiry.entity';

describe('EnquiriesService', () => {
  it('should successfully save an enquiry and return formatted reference number', async () => {
    const mockRepo = {
      create: vi.fn().mockImplementation((dto) => dto),
      save: vi.fn().mockImplementation(async (item) => ({
        ...item,
        createdAt: new Date(),
      })),
      findOne: vi.fn(),
    } as any;

    const service = new EnquiriesService(mockRepo);
    const result = await service.createEnquiry({
      fullName: 'Rahul Desai',
      email: 'rahul.desai@example.com',
      phone: '+91 98765 43210',
      relationshipToParent: 'Son',
      parentLocality: 'Alkapuri',
      serviceOfInterest: 'regular-support',
      contactConsent: true,
    });

    expect(result.success).toBe(true);
    expect(result.referenceNumber).toMatch(/^ASC-ENQ-\d{6}$/);
    expect(result.status).toBe(EnquiryStatus.NEW);
    expect(mockRepo.save).toHaveBeenCalled();
  });

  it('should discard bot submissions with honeypot filled', async () => {
    const mockRepo = {
      save: vi.fn(),
    } as any;

    const service = new EnquiriesService(mockRepo);
    const result = await service.createEnquiry({
      fullName: 'Spam Bot',
      email: 'bot@spam.com',
      phone: '+1 555 555 5555',
      relationshipToParent: 'Spam',
      parentLocality: 'Nowhere',
      serviceOfInterest: 'any',
      contactConsent: true,
      botHoneypot: 'i am a spam bot',
    });

    expect(result.success).toBe(true);
    expect(result.referenceNumber).toBe('ASC-ENQ-000000');
    expect(mockRepo.save).not.toHaveBeenCalled();
  });
});
