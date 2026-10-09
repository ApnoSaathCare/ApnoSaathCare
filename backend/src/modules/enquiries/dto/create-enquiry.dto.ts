import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
  Equals,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEnquiryDto {
  @ApiProperty({ description: 'Full name of the person making the enquiry', example: 'Rahul Desai' })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  @MaxLength(120, { message: 'Full name cannot exceed 120 characters' })
  fullName: string;

  @ApiProperty({ description: 'Contact email address', example: 'rahul.desai@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(150)
  email: string;

  @ApiProperty({ description: 'Phone number with country code', example: '+91 98765 43210' })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @MinLength(7, { message: 'Phone number must be at least 7 digits' })
  @MaxLength(30)
  phone: string;

  @ApiProperty({ description: 'Relationship to parent (e.g. Son, Daughter, Relative)', example: 'Son' })
  @IsString()
  @IsNotEmpty({ message: 'Relationship to parent is required' })
  @MaxLength(60)
  relationshipToParent: string;

  @ApiPropertyOptional({ description: 'City where parent resides', example: 'Vadodara', default: 'Vadodara' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  parentCity?: string;

  @ApiProperty({ description: 'Locality or area in Vadodara', example: 'Alkapuri' })
  @IsString()
  @IsNotEmpty({ message: 'Parent locality is required' })
  @MaxLength(120)
  parentLocality: string;

  @ApiPropertyOptional({ description: 'Vadodara PIN code', example: '390007' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  parentPincode?: string;

  @ApiPropertyOptional({ description: "Parent's preferred first name", example: 'Kiritbhai' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  parentPreferredName?: string;

  @ApiProperty({ description: 'Service or plan of interest', example: 'regular-support' })
  @IsString()
  @IsNotEmpty({ message: 'Service of interest is required' })
  @MaxLength(100)
  serviceOfInterest: string;

  @ApiPropertyOptional({
    description: 'Preferred contact method',
    enum: ['PHONE', 'EMAIL', 'WHATSAPP'],
    default: 'PHONE',
  })
  @IsOptional()
  @IsIn(['PHONE', 'EMAIL', 'WHATSAPP'])
  preferredContactMethod?: string;

  @ApiPropertyOptional({ description: 'Preferred consultation date (YYYY-MM-DD)', example: '2026-10-15' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  preferredConsultationDate?: string;

  @ApiPropertyOptional({ description: 'Preferred time window', example: 'Morning (9:00 AM - 12:00 PM)' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  preferredTimeWindow?: string;

  @ApiPropertyOptional({ description: 'Additional brief non-medical notes or context', example: 'Looking for weekly check-ins and errand assistance.' })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Message cannot exceed 1000 characters' })
  message?: string;

  @ApiProperty({ description: 'Explicit consent to be contacted regarding this enquiry', example: true })
  @Equals(true, { message: 'Consent to be contacted is required to submit an enquiry' })
  contactConsent: boolean;

  @ApiPropertyOptional({ description: 'Version of privacy notice accepted', example: 'v1.0' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  privacyNoticeVersion?: string;

  @ApiPropertyOptional({ description: 'Honeypot field for bot spam detection (must remain empty)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  botHoneypot?: string;
}

export interface EnquirySubmissionResponse {
  success: boolean;
  referenceNumber: string;
  message: string;
  status: string;
  createdAt: Date;
}
