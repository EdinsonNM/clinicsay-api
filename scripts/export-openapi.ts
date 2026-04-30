import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import { swaggerConfig } from '../src/common/swagger/swagger.config';

async function exportOpenApi() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  writeFileSync(join(__dirname, '..', 'openapi.json'), JSON.stringify(document, null, 2));
  await app.close();
}

exportOpenApi().catch((error) => {
  console.error(error);
  process.exit(1);
});
