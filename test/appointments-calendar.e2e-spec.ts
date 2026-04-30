import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

type JsonApiListResponse = {
  data: unknown[];
};

describe('Appointments calendar (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => app.close());

  it('lists appointments inside range', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/appointments?from=2026-05-01&to=2026-05-31')
      .expect(200)
      .expect(({ body }) => {
        const response = body as JsonApiListResponse;
        expect(response.data.length).toBeGreaterThan(0);
      });
  });
});
