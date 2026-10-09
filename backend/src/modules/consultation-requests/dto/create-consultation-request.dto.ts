import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConsultationRequestDto {
  @ApiProperty({ description: 'Full name of the requesting family member', example: 'Ananya Patel' })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  @MaxLength(120, { message: 'Full name cannot exceed 120 characters' })
  fullName: string;

  @ApiProperty({ description: 'Contact email address', example: 'ananya.patel@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(150)
  email: string;

  @ApiProperty({ description: 'Phone number with country code', example: '+91 91234 56789' })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @MinLength(7, { message: 'Phone number must be at least 7 digits' })
  @MaxLength(30)
  phone: string;

  @ApiProperty({ description: 'Preferred consultation date (YYYY-MM-DD)', example: '2026-10-18' })
  @IsString()
  @IsNotEmpty({ message: 'Preferred consultation date is required' })
  @MaxLength(30)
  preferredDate: string;

  @ApiProperty({ description: 'Preferred time window', example: 'Morning (9:00 AM - 12:00 PM)' })
  @IsString()
  @IsNotEmpty({ message: 'Preferred time window is required' })
  @MaxLength(60)
  preferredTimeWindow: string;

  @ApiPropertyOptional({
    description: 'Consultation method (PHONE, VIDEO_CALL, WHATSAPP_CALL)',
    enum: ['PHONE', 'VIDEO_CALL', 'WHATSAPP_CALL'],
    default: 'PHONE',
  })
  @IsOptional()
  @IsIn(['PHONE', 'VIDEO_CALL', 'WHATSAPP_CALL'])
  consultationMethod?: string;

  @ApiPropertyOptional({
    description: 'Brief description of parent support requirements',
    example: 'Initial discussion on weekly companionship and grocery errand support.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Support requirements note cannot exceed 1000 characters' })
  supportRequirements?: string;

  @ApiPropertyOptional({ description: 'Honeypot field for bot spam detection (must remain empty)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  botHoneypot?: string;
}

export interface ConsultationSubmissionResponse {
  success: boolean;
  referenceNumber: string;
  message: string;
  status: string;
  createdAt: Date;
}
