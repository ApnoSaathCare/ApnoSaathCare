import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ConsultationRequest,
  ConsultationStatus,
} from '../../database/entities/consultation-request.entity';
import {
  CreateConsultationRequestDto,
  ConsultationSubmissionResponse,
} from './dto/create-consultation-request.dto';
import { ReferenceGenerator } from '../../common/utils/reference-generator.util';

@Injectable()
export class ConsultationRequestsService {
  private readonly logger = new Logger(ConsultationRequestsService.name);

  constructor(
    @InjectRepository(ConsultationRequest)
    private readonly consultationRepo: Repository<ConsultationRequest>,
  ) {}

  async createRequest(
    dto: CreateConsultationRequestDto,
  ): Promise<ConsultationSubmissionResponse> {
    if (dto.botHoneypot && dto.botHoneypot.trim().length > 0) {
      this.logger.warn('Spam consultation request discarded via honeypot');
      return {
        success: true,
        referenceNumber: 'ASC-CON-000000',
        message: 'Your consultation request has been submitted.',
        status: 'PENDING_CONFIRMATION',
        createdAt: new Date(),
      };
    }

    const referenceNumber = ReferenceGenerator.generate('CON');
    const id = ReferenceGenerator.generateId();

    const request = this.consultationRepo.create({
      id,
      referenceNumber,
      fullName: dto.fullName.trim(),
      email: dto.email.trim().toLowerCase(),
      phone: dto.phone.trim(),
      preferredDate: dto.preferredDate.trim(),
      preferredTimeWindow: dto.preferredTimeWindow.trim(),
      consultationMethod: dto.consultationMethod || 'PHONE',
      supportRequirements: dto.supportRequirements?.trim() || null,
      status: ConsultationStatus.PENDING_CONFIRMATION,
    });

    const saved = await this.consultationRepo.save(request);

    this.logger.log(`New consultation requested with reference: ${referenceNumber}`);

    return {
      success: true,
      referenceNumber: saved.referenceNumber,
      message:
        'Your consultation request has been received. Our Vadodara team will review availability and confirm your scheduled slot.',
      status: saved.status,
      createdAt: saved.createdAt,
    };
  }

  async getPublicStatus(referenceNumber: string) {
    const item = await this.consultationRepo.findOne({
      where: { referenceNumber },
      select: {
        referenceNumber: true,
        status: true,
        preferredDate: true,
        preferredTimeWindow: true,
        consultationMethod: true,
        createdAt: true,
      },
    });

    if (!item) {
      throw new NotFoundException(
        `No consultation request found for reference ${referenceNumber}`,
      );
    }

    return {
      referenceNumber: item.referenceNumber,
      status: item.status,
      preferredDate: item.preferredDate,
      preferredTimeWindow: item.preferredTimeWindow,
      consultationMethod: item.consultationMethod,
      createdAt: item.createdAt,
    };
  }
}
