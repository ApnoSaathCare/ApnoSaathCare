import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AssistantService } from './assistant.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ChatResponseDto, QuickPromptsResponseDto } from './dto/chat-response.dto';

@ApiTags('ai-assistant')
@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get('quick-prompts')
  @ApiOperation({
    summary: 'Get welcome greeting and initial starter prompts for the visitor',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Welcome metadata and suggested starter prompts',
    type: QuickPromptsResponseDto,
  })
  async getQuickPrompts(): Promise<QuickPromptsResponseDto> {
    return this.assistantService.getQuickPrompts();
  }

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({
    summary: 'Send a conversational query to AapnoSaath Care Virtual Assistant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Assistant reply with suggested actions and next steps',
    type: ChatResponseDto,
  })
  async chat(@Body() dto: ChatRequestDto): Promise<ChatResponseDto> {
    return this.assistantService.chat(dto);
  }
}
