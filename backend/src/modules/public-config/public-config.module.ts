import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PublicConfigController } from './public-config.controller';
import { PublicConfigService } from './public-config.service';

@Module({
  imports: [ConfigModule],
  controllers: [PublicConfigController],
  providers: [PublicConfigService],
  exports: [PublicConfigService],
})
export class PublicConfigModule {}
