import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServicePlansModule } from '../service-plans/service-plans.module';
import { ServiceAreasModule } from '../service-areas/service-areas.module';
import { PublicConfigModule } from '../public-config/public-config.module';
import { AssistantController } from './assistant.controller';
import { AssistantService } from './assistant.service';

@Module({
  imports: [
    ConfigModule,
    ServicePlansModule,
    ServiceAreasModule,
    PublicConfigModule,
  ],
  controllers: [AssistantController],
  providers: [AssistantService],
  exports: [AssistantService],
})
export class AssistantModule {}
