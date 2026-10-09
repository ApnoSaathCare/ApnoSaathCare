import { describe, it, expect, vi } from 'vitest';
import { ServicePlansService } from './service-plans.service';
import { NotFoundException } from '@nestjs/common';

describe('ServicePlansService', () => {
  it('should find published service plans in display order', async () => {
    const mockPlans = [
      { id: 'sp-1', name: 'Family Check-in', slug: 'family-check-in', isPublished: true, displayOrder: 1 },
      { id: 'sp-2', name: 'Regular Support', slug: 'regular-support', isPublished: true, displayOrder: 2 },
    ];

    const mockRepo = {
      find: vi.fn().mockResolvedValue(mockPlans),
      findOne: vi.fn(),
    } as any;

    const service = new ServicePlansService(mockRepo);
    const result = await service.findAllPublished();

    expect(result).toHaveLength(2);
    expect(mockRepo.find).toHaveBeenCalledWith({
      where: { isPublished: true },
      order: { displayOrder: 'ASC' },
    });
  });

  it('should throw NotFoundException if plan slug does not exist', async () => {
    const mockRepo = {
      findOne: vi.fn().mockResolvedValue(null),
    } as any;

    const service = new ServicePlansService(mockRepo);
    await expect(service.findBySlug('non-existent')).rejects.toThrow(NotFoundException);
  });
});
