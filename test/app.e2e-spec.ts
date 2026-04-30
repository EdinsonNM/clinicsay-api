import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

type JsonApiListResponse = {
  data: unknown[];
};

describe('ClinicSay app (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  it('/api/v1/specialties (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/specialties')
      .expect(200)
      .expect(({ body }) => {
        const response = body as JsonApiListResponse;
        expect(response.data.length).toBeGreaterThan(0);
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
