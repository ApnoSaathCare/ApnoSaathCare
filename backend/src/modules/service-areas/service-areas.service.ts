import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ServiceArea } from '../../database/entities/service-area.entity';
import {
  CheckServiceAreaDto,
  ServiceAreaCheckResponse,
  ServiceAreaStatus,
} from './dto/check-service-area.dto';

@Injectable()
export class ServiceAreasService {
  constructor(
    @InjectRepository(ServiceArea)
    private readonly serviceAreaRepository: Repository<ServiceArea>,
  ) {}

  async findAllActive(): Promise<ServiceArea[]> {
    return this.serviceAreaRepository.find({
      where: { isActive: true },
      order: { localityName: 'ASC' },
    });
  }

  async checkCoverage(dto: CheckServiceAreaDto): Promise<ServiceAreaCheckResponse> {
    const rawLocality = dto.locality?.trim();
    const rawPincode = dto.pincode?.trim();

    if (!rawLocality && !rawPincode) {
      return {
        status: ServiceAreaStatus.NEEDS_CONFIRMATION,
        city: 'Vadodara',
        state: 'Gujarat',
        message:
          'Please provide a locality or PIN code in Vadodara to check service availability.',
        notes: 'Availability needs confirmation.',
      };
    }

    // First search by exact or case-insensitive partial match
    let matchedArea: ServiceArea | null = null;

    if (rawLocality) {
      matchedArea = await this.serviceAreaRepository.findOne({
        where: {
          localityName: Like(`%${rawLocality}%`),
          isActive: true,
        },
      });
    }

    if (!matchedArea && rawPincode) {
      matchedArea = await this.serviceAreaRepository.findOne({
        where: {
          pincode: rawPincode,
          isActive: true,
        },
      });
    }

    if (matchedArea) {
      return {
        status: ServiceAreaStatus.AVAILABLE,
        locality: matchedArea.localityName,
        pincode: matchedArea.pincode,
        city: matchedArea.city,
        state: matchedArea.state,
        message:
          'Your locality is currently within our service area in Vadodara. Submit an enquiry to confirm scheduling for your specific requirements.',
        notes:
          matchedArea.coverageNotes ||
          'Standard scheduling availability subject to review.',
      };
    }

    // If pincode starts with Vadodara postal prefix 390 or 391
    if (rawPincode && (rawPincode.startsWith('390') || rawPincode.startsWith('391'))) {
      return {
        status: ServiceAreaStatus.NEEDS_CONFIRMATION,
        locality: rawLocality || 'Vadodara Locality',
        pincode: rawPincode,
        city: 'Vadodara',
        state: 'Gujarat',
        message:
          'We need to confirm availability for this specific PIN code before accepting a booking. Please submit an enquiry and our team will review coverage.',
        notes: 'Locality is within Vadodara district; routing availability needs confirmation.',
      };
    }

    return {
      status: ServiceAreaStatus.NOT_CURRENTLY_LISTED,
      locality: rawLocality,
      pincode: rawPincode,
      city: 'Vadodara',
      state: 'Gujarat',
      message:
        'We have not yet confirmed service coverage for this locality. Please submit an enquiry, and our team will review your request.',
      notes: 'Currently expanding coverage across Vadodara.',
    };
  }
}
