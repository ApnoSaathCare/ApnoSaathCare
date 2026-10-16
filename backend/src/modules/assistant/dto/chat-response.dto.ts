import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ActionCtaDto {
  @ApiProperty({ description: 'Button label text', example: 'Book Free Consultation' })
  label: string;

  @ApiProperty({ description: 'Target path or action identifier', example: '/consultation' })
  targetUrl: string;

  @ApiProperty({ description: 'CTA visual type', example: 'consultation' })
  type: 'consultation' | 'area_checker' | 'plans' | 'emergency';
}

export class ChatResponseDto {
  @ApiProperty({
    description: 'Formatted markdown response from the virtual assistant',
    example: 'Namaste! At AapnoSaath Care, we offer dedicated elder-care coordination in Vadodara...',
  })
  reply: string;

  @ApiProperty({
    description: 'Suggested quick responses or next steps',
    example: ['Book a Free Consultation', 'Check Vadodara Pincode', 'View Regular Support Plan'],
  })
  suggestedActions: string[];

  @ApiProperty({
    description: 'Detected user intent category',
    example: 'consultation',
  })
  detectedIntent: 'consultation' | 'pricing' | 'service_area' | 'emergency' | 'general';

  @ApiPropertyOptional({
    description: 'Primary interactive call-to-action button when relevant',
    type: ActionCtaDto,
  })
  actionCta?: ActionCtaDto;

  @ApiProperty({
    description: 'ISO timestamp of the response generation',
    example: '2026-10-15T09:30:00.000Z',
  })
  timestamp: string;
}

export class QuickPromptItemDto {
  @ApiProperty({ description: 'User-facing chip label', example: 'What plans do you offer?' })
  label: string;

  @ApiProperty({ description: 'Actual prompt to send', example: 'Can you explain the published care plans and pricing?' })
  prompt: string;

  @ApiPropertyOptional({ description: 'Icon name or identifier', example: 'heart' })
  icon?: string;
}

export class QuickPromptsResponseDto {
  @ApiProperty({ description: 'Initial welcoming greeting text' })
  welcomeMessage: string;

  @ApiProperty({ description: 'Tagline' })
  tagline: string;

  @ApiProperty({ description: 'City and state served' })
  serviceArea: string;

  @ApiProperty({ description: 'Starter prompts for the visitor', type: [QuickPromptItemDto] })
  prompts: QuickPromptItemDto[];
}
