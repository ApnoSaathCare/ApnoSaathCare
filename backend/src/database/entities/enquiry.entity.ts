import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum EnquiryStatus {
  NEW = 'NEW',
  REVIEWED = 'REVIEWED',
  CONTACTED = 'CONTACTED',
  RESOLVED = 'RESOLVED',
}

@Entity('enquiries')
export class Enquiry {
  @PrimaryColumn({ length: 36 })
  id: string;

  @Index({ unique: true })
  @Column({ length: 32 })
  referenceNumber: string;

  @Column({ length: 120 })
  fullName: string;

  @Column({ length: 150 })
  email: string;

  @Column({ length: 30 })
  phone: string;

  @Column({ length: 60 })
  relationshipToParent: string;

  @Column({ length: 100, default: 'Vadodara' })
  parentCity: string;

  @Column({ length: 120 })
  parentLocality: string;

  @Column({ length: 10, nullable: true })
  parentPincode: string;

  @Column({ length: 100, nullable: true })
  parentPreferredName: string;

  @Column({ length: 100 })
  serviceOfInterest: string;

  @Column({ length: 30, default: 'PHONE' })
  preferredContactMethod: string;

  @Column({ length: 30, nullable: true })
  preferredConsultationDate: string;

  @Column({ length: 60, nullable: true })
  preferredTimeWindow: string;

  @Column('text', { nullable: true })
  message: string;

  @Column({ default: false })
  contactConsent: boolean;

  @Column({ length: 20, default: 'v1.0' })
  privacyNoticeVersion: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 40,
    default: EnquiryStatus.NEW,
  })
  status: EnquiryStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
