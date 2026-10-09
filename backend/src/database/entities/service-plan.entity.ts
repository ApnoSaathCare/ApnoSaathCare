import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('service_plans')
export class ServicePlan {
  @PrimaryColumn({ length: 36 })
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, unique: true })
  slug: string;

  @Column('text')
  shortDescription: string;

  @Column('decimal', { precision: 10, scale: 2 })
  priceAmount: number;

  @Column({ length: 10, default: 'INR' })
  currencyCode: string;

  @Column({ length: 50 })
  billingPeriod: string;

  @Column('simple-json', { default: '[]' })
  inclusions: string[];

  @Column('simple-json', { default: '[]' })
  exclusions: string[];

  @Column({ default: true })
  isPublished: boolean;

  @Column({ default: 0 })
  displayOrder: number;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
