import { describe, it, expect, vi } from 'vitest';
import { ServiceAreasService } from './service-areas.service';
import { ServiceAreaStatus } from './dto/check-service-area.dto';

describe('ServiceAreasService', () => {
  it('should return AVAILABLE for matched Vadodara locality', async () => {
    const mockArea = {
      id: 'sa-001',
      localityName: 'Alkapuri',
      pincode: '390007',
      city: 'Vadodara',
      state: 'Gujarat',
      isActive: true,
      coverageNotes: 'Core coverage zone',
    };

    const mockRepo = {
      findOne: vi.fn().mockResolvedValue(mockArea),
      find: vi.fn(),
    } as any;

    const service = new ServiceAreasService(mockRepo);
    const res = await service.checkCoverage({ locality: 'Alkapuri' });

    expect(res.status).toBe(ServiceAreaStatus.AVAILABLE);
    expect(res.locality).toBe('Alkapuri');
    expect(res.city).toBe('Vadodara');
  });

  it('should return NEEDS_CONFIRMATION for Vadodara pincode 390xxx when locality is unlisted', async () => {
    const mockRepo = {
      findOne: vi.fn().mockResolvedValue(null),
    } as any;

    const service = new ServiceAreasService(mockRepo);
    const res = await service.checkCoverage({ locality: 'Unknown Area', pincode: '390099' });

    expect(res.status).toBe(ServiceAreaStatus.NEEDS_CONFIRMATION);
    expect(res.pincode).toBe('390099');
  });

  it('should return NOT_CURRENTLY_LISTED for unfamiliar location outside Vadodara', async () => {
    const mockRepo = {
      findOne: vi.fn().mockResolvedValue(null),
    } as any;

    const service = new ServiceAreasService(mockRepo);
    const res = await service.checkCoverage({ locality: 'Ahmedabad Navrangpura', pincode: '380009' });

    expect(res.status).toBe(ServiceAreaStatus.NOT_CURRENTLY_LISTED);
  });
});
