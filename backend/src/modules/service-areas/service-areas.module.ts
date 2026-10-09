import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceArea } from '../../database/entities/service-area.entity';
import { ServiceAreasController } from './service-areas.controller';
import { ServiceAreasService } from './service-areas.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceArea])],
  controllers: [ServiceAreasController],
  providers: [ServiceAreasService],
  exports: [ServiceAreasService],
})
export class ServiceAreasModule {}
