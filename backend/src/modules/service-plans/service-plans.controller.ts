import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ServicePlansService } from './service-plans.service';
import { ServicePlan } from '../../database/entities/service-plan.entity';

@ApiTags('services')
@Controller('services')
export class ServicePlansController {
  constructor(private readonly servicePlansService: ServicePlansService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all published service plans and pilot pricing' })
  @ApiResponse({ status: 200, description: 'List of active service plans' })
  async getAllPlans(): Promise<ServicePlan[]> {
    return this.servicePlansService.findAllPublished();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Retrieve specific service plan by unique slug' })
  @ApiParam({ name: 'slug', description: 'Plan unique slug (e.g. family-check-in)' })
  @ApiResponse({ status: 200, description: 'Service plan details' })
  @ApiResponse({ status: 404, description: 'Service plan not found' })
  async getPlanBySlug(@Param('slug') slug: string): Promise<ServicePlan> {
    return this.servicePlansService.findBySlug(slug);
  }
}
