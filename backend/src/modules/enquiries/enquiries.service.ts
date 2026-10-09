import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enquiry, EnquiryStatus } from '../../database/entities/enquiry.entity';
import { CreateEnquiryDto, EnquirySubmissionResponse } from './dto/create-enquiry.dto';
import { ReferenceGenerator } from '../../common/utils/reference-generator.util';

@Injectable()
export class EnquiriesService {
  private readonly logger = new Logger(EnquiriesService.name);

  constructor(
    @InjectRepository(Enquiry)
    private readonly enquiryRepository: Repository<Enquiry>,
  ) {}

  async createEnquiry(dto: CreateEnquiryDto): Promise<EnquirySubmissionResponse> {
    // Spam / Honeypot mitigation: If bot filled the hidden honeypot field, return dummy confirmation
    if (dto.botHoneypot && dto.botHoneypot.trim().length > 0) {
      this.logger.warn('Spam submission detected and discarded via honeypot');
      return {
        success: true,
        referenceNumber: 'ASC-ENQ-000000',
        message: 'Your enquiry has been received.',
        status: 'NEW',
        createdAt: new Date(),
      };
    }

    const referenceNumber = ReferenceGenerator.generate('ENQ');
    const id = ReferenceGenerator.generateId();

    const enquiry = this.enquiryRepository.create({
      id,
      referenceNumber,
      fullName: dto.fullName.trim(),
      email: dto.email.trim().toLowerCase(),
      phone: dto.phone.trim(),
      relationshipToParent: dto.relationshipToParent.trim(),
      parentCity: dto.parentCity?.trim() || 'Vadodara',
      parentLocality: dto.parentLocality.trim(),
      parentPincode: dto.parentPincode?.trim() || null,
      parentPreferredName: dto.parentPreferredName?.trim() || null,
      serviceOfInterest: dto.serviceOfInterest.trim(),
      preferredContactMethod: dto.preferredContactMethod || 'PHONE',
      preferredConsultationDate: dto.preferredConsultationDate || null,
      preferredTimeWindow: dto.preferredTimeWindow || null,
      message: dto.message?.trim() || null,
      contactConsent: dto.contactConsent,
      privacyNoticeVersion: dto.privacyNoticeVersion || 'v1.0',
      status: EnquiryStatus.NEW,
    });

    const savedEnquiry = await this.enquiryRepository.save(enquiry);

    this.logger.log(
      `New enquiry recorded with reference: ${referenceNumber} for locality ${savedEnquiry.parentLocality}`,
    );

    return {
      success: true,
      referenceNumber: savedEnquiry.referenceNumber,
      message:
        'Thank you. Your enquiry has been received. Our team in Vadodara will contact you shortly to understand your family’s needs.',
      status: savedEnquiry.status,
      createdAt: savedEnquiry.createdAt,
    };
  }

  async getPublicStatus(referenceNumber: string) {
    const enquiry = await this.enquiryRepository.findOne({
      where: { referenceNumber },
      select: {
        referenceNumber: true,
        status: true,
        serviceOfInterest: true,
        parentCity: true,
        createdAt: true,
      },
    });

    if (!enquiry) {
      throw new NotFoundException(
        `No enquiry record found for reference ${referenceNumber}`,
      );
    }

    return {
      referenceNumber: enquiry.referenceNumber,
      status: enquiry.status,
      serviceOfInterest: enquiry.serviceOfInterest,
      parentCity: enquiry.parentCity,
      createdAt: enquiry.createdAt,
    };
  }
}
