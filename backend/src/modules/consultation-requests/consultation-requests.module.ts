import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultationRequest } from '../../database/entities/consultation-request.entity';
import { ConsultationRequestsController } from './consultation-requests.controller';
import { ConsultationRequestsService } from './consultation-requests.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([ConsultationRequest]), MailModule],
  controllers: [ConsultationRequestsController],
  providers: [ConsultationRequestsService],
  exports: [ConsultationRequestsService],
})
export class ConsultationRequestsModule {}
