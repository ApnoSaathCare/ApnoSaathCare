import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PublicConfigService, PublicConfigResponse } from './public-config.service';

@ApiTags('public-config')
@Controller('public-config')
export class PublicConfigController {
  constructor(private readonly configService: PublicConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve non-sensitive public business settings and contact placeholders' })
  @ApiResponse({ status: 200, description: 'Public configuration details' })
  getPublicConfig(): PublicConfigResponse {
    return this.configService.getPublicConfig();
  }
}
