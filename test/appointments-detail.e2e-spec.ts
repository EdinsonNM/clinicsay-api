import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

type AppointmentDetailResponse = {
  data: { type: string };
  included?: unknown[];
};

describe('Appointment detail projections (e2e)', () => {
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

  it('returns JSON:API-like detail with safe includes and fields', async () => {
    await request(app.getHttpServer())
      .get(
        '/api/v1/appointments/cl-12345?include=patient,doctor.specialty&fields[appointments]=date,status&fields[patients]=fullName,dni',
      )
      .expect(200)
      .expect(({ body }) => {
        const response = body as AppointmentDetailResponse;
        const serialized = JSON.stringify(response);
        expect(response.data.type).toBe('appointments');
        expect(response.included).toEqual(expect.any(Array));
        expect(serialized).not.toContain('juan@example.com');
        expect(serialized).not.toContain('999111222');
        expect(serialized).not.toContain('Av. Demo');
      });
  });

  it('rejects private patient fields', async () => {
    await request(app.getHttpServer())
      .get(
        '/api/v1/appointments/cl-12345?include=patient&fields[patients]=email',
      )
      .expect(400);
  });
});
