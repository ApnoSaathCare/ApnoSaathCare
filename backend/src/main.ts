import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Ensure data directory exists for sqlite storage if used
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const app = await NestFactory.create(AppModule);

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows swagger UI assets
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Global API Prefix
  app.setGlobalPrefix('api/v1');

  // CORS Configuration
  const rawCorsOrigin = process.env.CORS_ORIGIN;
  let originSetting: any = true;
  if (rawCorsOrigin && rawCorsOrigin !== '*') {
    originSetting = rawCorsOrigin.includes(',')
      ? rawCorsOrigin.split(',').map((o) => o.trim())
      : rawCorsOrigin;
  }

  app.enableCors({
    origin: originSetting,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger / OpenAPI Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('AapnoSaath Care API')
    .setDescription(
      'RESTful Public API for AapnoSaath Care elder-care support and family coordination in Vadodara, Gujarat.',
    )
    .setVersion('1.0.0')
    .addTag('services', 'Service plans and transparent pricing')
    .addTag('service-areas', 'Vadodara locality coverage checker')
    .addTag('enquiries', 'Public enquiries management')
    .addTag('consultation-requests', 'Consultation booking requests')
    .addTag('public-config', 'Public metadata and contact details')
    .addTag('health', 'System health status')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'AapnoSaath Care API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`AapnoSaath Care Backend running on: http://localhost:${port}/api/v1`);
  logger.log(`Interactive API Docs available at: http://localhost:${port}/api/docs`);
}

bootstrap();
