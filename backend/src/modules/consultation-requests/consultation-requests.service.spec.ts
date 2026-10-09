import { describe, it, expect, vi } from 'vitest';
import { ConsultationRequestsService } from './consultation-requests.service';
import { ConsultationStatus } from '../../database/entities/consultation-request.entity';

describe('ConsultationRequestsService', () => {
  it('should successfully record a consultation request', async () => {
    const mockRepo = {
      create: vi.fn().mockImplementation((dto) => dto),
      save: vi.fn().mockImplementation(async (item) => ({
        ...item,
        createdAt: new Date(),
      })),
      findOne: vi.fn(),
    } as any;

    const service = new ConsultationRequestsService(mockRepo);
    const result = await service.createRequest({
      fullName: 'Ananya Patel',
      email: 'ananya.patel@example.com',
      phone: '+91 91234 56789',
      preferredDate: '2026-10-18',
      preferredTimeWindow: 'Morning (9:00 AM - 12:00 PM)',
      consultationMethod: 'PHONE',
    });

    expect(result.success).toBe(true);
    expect(result.referenceNumber).toMatch(/^ASC-CON-\d{6}$/);
    expect(result.status).toBe(ConsultationStatus.PENDING_CONFIRMATION);
    expect(mockRepo.save).toHaveBeenCalled();
  });
});
