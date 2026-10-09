import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum ConsultationStatus {
  PENDING_CONFIRMATION = 'PENDING_CONFIRMATION',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('consultation_requests')
export class ConsultationRequest {
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

  @Column({ length: 30 })
  preferredDate: string;

  @Column({ length: 60 })
  preferredTimeWindow: string;

  @Column({ length: 40, default: 'PHONE' })
  consultationMethod: string;

  @Column('text', { nullable: true })
  supportRequirements: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 40,
    default: ConsultationStatus.PENDING_CONFIRMATION,
  })
  status: ConsultationStatus;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
