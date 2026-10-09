import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicePlan } from '../../database/entities/service-plan.entity';
import { ServicePlansController } from './service-plans.controller';
import { ServicePlansService } from './service-plans.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServicePlan])],
  controllers: [ServicePlansController],
  providers: [ServicePlansService],
  exports: [ServicePlansService],
})
export class ServicePlansModule {}
