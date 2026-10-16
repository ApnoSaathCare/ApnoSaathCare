import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { ServicePlan } from './database/entities/service-plan.entity';
import { ServiceArea } from './database/entities/service-area.entity';
import { Enquiry } from './database/entities/enquiry.entity';
import { ConsultationRequest } from './database/entities/consultation-request.entity';

import { HealthModule } from './modules/health/health.module';
import { PublicConfigModule } from './modules/public-config/public-config.module';
import { ServicePlansModule } from './modules/service-plans/service-plans.module';
import { ServiceAreasModule } from './modules/service-areas/service-areas.module';
import { EnquiriesModule } from './modules/enquiries/enquiries.module';
import { ConsultationRequestsModule } from './modules/consultation-requests/consultation-requests.module';
import { AssistantModule } from './modules/assistant/assistant.module';

import { runInitialSeeds } from './database/seeds/initial-seed';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env'],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: (config.get<number>('RATE_LIMIT_TTL') || 60) * 1000,
          limit: config.get<number>('RATE_LIMIT_LIMIT') || 60,
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): any => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        const dbType = config.get<string>('DB_TYPE', databaseUrl ? 'postgres' : 'sqlite');

        if (dbType === 'postgres' || !!databaseUrl) {
          const isSsl =
            config.get<string>('DB_SSL') === 'true' ||
            (!!databaseUrl && !databaseUrl.includes('localhost') && !databaseUrl.includes('127.0.0.1'));

          return {
            type: 'postgres',
            ...(databaseUrl
              ? { url: databaseUrl }
              : {
                  host: config.get<string>('DB_HOST', 'localhost'),
                  port: config.get<number>('DB_PORT', 5432),
                  username: config.get<string>('DB_USERNAME', 'postgres'),
                  password: config.get<string>('DB_PASSWORD', 'postgres'),
                  database: config.get<string>('DB_DATABASE', 'aapnosaath_care'),
                }),
            ssl: isSsl ? { rejectUnauthorized: false } : false,
            extra: isSsl ? { ssl: { rejectUnauthorized: false } } : {},
            entities: [ServicePlan, ServiceArea, Enquiry, ConsultationRequest],
            synchronize: config.get<boolean>('DB_SYNCHRONIZE', true),
            logging: config.get<boolean>('DB_LOGGING', false),
          };
        }

        // SQL.js fallback for zero-dependency local development / testing
        return {
          type: 'sqljs',
          location: 'data/aapnosaath.sqlite',
          autoSave: true,
          entities: [ServicePlan, ServiceArea, Enquiry, ConsultationRequest],
          synchronize: true,
          logging: false,
        };
      },
    }),
    HealthModule,
    PublicConfigModule,
    ServicePlansModule,
    ServiceAreasModule,
    EnquiriesModule,
    ConsultationRequestsModule,
    AssistantModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    try {
      await runInitialSeeds(this.dataSource);
    } catch (err) {
      console.warn('Seed initialization error (ignorable if tables already seeded):', err);
    }
  }
}
