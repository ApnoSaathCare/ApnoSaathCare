import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('service_areas')
export class ServiceArea {
  @PrimaryColumn({ length: 36 })
  id: string;

  @Index()
  @Column({ length: 120 })
  localityName: string;

  @Index()
  @Column({ length: 10, nullable: true })
  pincode: string;

  @Column({ length: 100, default: 'Vadodara' })
  city: string;

  @Column({ length: 100, default: 'Gujarat' })
  state: string;

  @Index()
  @Column({ default: true })
  isActive: boolean;

  @Column('text', { nullable: true })
  coverageNotes: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
