import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ConsultationRequestsService } from './consultation-requests.service';
import {
  CreateConsultationRequestDto,
  ConsultationSubmissionResponse,
} from './dto/create-consultation-request.dto';

@ApiTags('consultation-requests')
@Controller('consultation-requests')
export class ConsultationRequestsController {
  constructor(
    private readonly consultationService: ConsultationRequestsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Submit a consultation booking request' })
  @ApiResponse({ status: 201, description: 'Consultation request submitted' })
  @ApiResponse({ status: 400, description: 'Validation error in submission' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async createRequest(
    @Body() dto: CreateConsultationRequestDto,
  ): Promise<ConsultationSubmissionResponse> {
    return this.consultationService.createRequest(dto);
  }

  @Get(':referenceNumber/status')
  @ApiOperation({ summary: 'Retrieve public-safe status of consultation request by reference code' })
  @ApiParam({ name: 'referenceNumber', description: 'Reference code (e.g. ASC-CON-918234)' })
  @ApiResponse({ status: 200, description: 'Public submission status' })
  @ApiResponse({ status: 404, description: 'Consultation request reference not found' })
  async getStatus(@Param('referenceNumber') referenceNumber: string) {
    return this.consultationService.getPublicStatus(referenceNumber);
  }
}
