import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ServiceAreasService } from './service-areas.service';
import { CheckServiceAreaDto, ServiceAreaCheckResponse } from './dto/check-service-area.dto';
import { ServiceArea } from '../../database/entities/service-area.entity';

@ApiTags('service-areas')
@Controller('service-areas')
export class ServiceAreasController {
  constructor(private readonly serviceAreasService: ServiceAreasService) {}

  @Get()
  @ApiOperation({ summary: 'List all active configured service areas in Vadodara' })
  @ApiResponse({ status: 200, description: 'List of active service areas' })
  async getActiveAreas(): Promise<ServiceArea[]> {
    return this.serviceAreasService.findAllActive();
  }

  @Get('check')
  @ApiOperation({ summary: 'Check service availability for a Vadodara locality or PIN code' })
  @ApiResponse({ status: 200, description: 'Service availability coverage result' })
  async checkCoverage(
    @Query() dto: CheckServiceAreaDto,
  ): Promise<ServiceAreaCheckResponse> {
    return this.serviceAreasService.checkCoverage(dto);
  }
}
