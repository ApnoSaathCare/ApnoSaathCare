import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CheckServiceAreaDto {
  @ApiPropertyOptional({ description: 'Locality name in Vadodara (e.g., Alkapuri, Gotri, Manjalpur)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  locality?: string;

  @ApiPropertyOptional({ description: 'Vadodara PIN code (e.g. 390007)' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  pincode?: string;
}

export enum ServiceAreaStatus {
  AVAILABLE = 'AVAILABLE',
  NEEDS_CONFIRMATION = 'NEEDS_CONFIRMATION',
  NOT_CURRENTLY_LISTED = 'NOT_CURRENTLY_LISTED',
}

export interface ServiceAreaCheckResponse {
  status: ServiceAreaStatus;
  locality?: string;
  pincode?: string;
  city: string;
  state: string;
  message: string;
  notes?: string;
}
