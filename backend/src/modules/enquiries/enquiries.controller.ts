import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { EnquiriesService } from './enquiries.service';
import { CreateEnquiryDto, EnquirySubmissionResponse } from './dto/create-enquiry.dto';

@ApiTags('enquiries')
@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Submit a new service enquiry' })
  @ApiResponse({ status: 201, description: 'Enquiry successfully submitted' })
  @ApiResponse({ status: 400, description: 'Validation error in submission' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async createEnquiry(@Body() dto: CreateEnquiryDto): Promise<EnquirySubmissionResponse> {
    return this.enquiriesService.createEnquiry(dto);
  }

  @Get(':referenceNumber/status')
  @ApiOperation({ summary: 'Retrieve public-safe status of an enquiry by reference code' })
  @ApiParam({ name: 'referenceNumber', description: 'Reference code (e.g. ASC-ENQ-849201)' })
  @ApiResponse({ status: 200, description: 'Public submission status' })
  @ApiResponse({ status: 404, description: 'Enquiry reference not found' })
  async getStatus(@Param('referenceNumber') referenceNumber: string) {
    return this.enquiriesService.getPublicStatus(referenceNumber);
  }
}
