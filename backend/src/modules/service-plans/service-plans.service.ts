import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServicePlan } from '../../database/entities/service-plan.entity';

@Injectable()
export class ServicePlansService {
  constructor(
    @InjectRepository(ServicePlan)
    private readonly servicePlanRepository: Repository<ServicePlan>,
  ) {}

  async findAllPublished(): Promise<ServicePlan[]> {
    return this.servicePlanRepository.find({
      where: { isPublished: true },
      order: { displayOrder: 'ASC' },
    });
  }

  async findBySlug(slug: string): Promise<ServicePlan> {
    const plan = await this.servicePlanRepository.findOne({
      where: { slug, isPublished: true },
    });

    if (!plan) {
      throw new NotFoundException(`Service plan '${slug}' was not found`);
    }

    return plan;
  }
}
