import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ChatRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  MODEL = 'model',
}

export class ChatMessageDto {
  @ApiProperty({
    description: 'Role of the message sender',
    enum: ChatRole,
    example: 'user',
  })
  @IsEnum(ChatRole, { message: 'Role must be user, assistant, or model' })
  role: ChatRole;

  @ApiProperty({
    description: 'Content of the message',
    example: 'Which care plans do you have for elderly parents in Vadodara?',
  })
  @IsString()
  @IsNotEmpty({ message: 'Message content cannot be empty' })
  @MinLength(1, { message: 'Message content must have at least 1 character' })
  @MaxLength(2000, { message: 'Individual message content cannot exceed 2000 characters' })
  content: string;
}

export class ChatRequestDto {
  @ApiProperty({
    description: 'Recent conversation history (ordered from oldest to newest)',
    type: [ChatMessageDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'At least one message is required' })
  @ArrayMaxSize(20, { message: 'Conversation history is capped at 20 messages' })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];

  @ApiPropertyOptional({
    description: 'Current locality context if known from user browsing',
    example: 'Alkapuri',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  contextLocality?: string;

  @ApiPropertyOptional({
    description: 'Current plan slug context if known from user browsing',
    example: 'family-check-in',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  contextPlanSlug?: string;
}
