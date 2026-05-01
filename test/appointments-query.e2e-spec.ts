import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

type JsonApiListResponse = {
  data: Array<{
    id: string;
    attributes: Record<string, unknown>;
    relationships: Record<string, unknown>;
  }>;
  included?: Array<{ type: string; id: string; attributes: Record<string, unknown> }>;
};

describe('Appointment projected queries (e2e)', () => {
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

  it('lists projected appointments by single date', async () => {
    await request(app.getHttpServer())
      .get(
        '/api/v1/appointments?date=2026-05-15&include=patient,doctor.specialty&fields[appointments]=date,status,reason&fields[patients]=fullName&fields[doctors]=name&fields[specialties]=name',
      )
      .expect(200)
      .expect(({ body }) => {
        const response = body as JsonApiListResponse;
        const serialized = JSON.stringify(response);
        expect(response.data).toHaveLength(1);
        expect(response.data[0].attributes).toEqual({
          date: '2026-05-15T10:00:00.000Z',
          status: 'SCHEDULED',
          reason: 'Consulta cardiologica',
        });
        expect(response.included?.some((item) => item.type === 'patients')).toBe(
          true,
        );
        expect(serialized).not.toContain('juan@example.com');
        expect(serialized).not.toContain('999111222');
        expect(serialized).not.toContain('Av. Demo 123');
      });
  });

  it('lists projected appointments by range and filters', async () => {
    await request(app.getHttpServer())
      .get(
        '/api/v1/appointments?from=2026-05-01&to=2026-05-31&doctorId=d-46&patientId=p-99&specialtyId=s-3&include=patient,doctor.specialty',
      )
      .expect(200)
      .expect(({ body }) => {
        const response = body as JsonApiListResponse;
        expect(response.data.map((item) => item.id)).toEqual(['cl-12347']);
      });
  });

  it('returns explicit patient private fields only when requested', async () => {
    await request(app.getHttpServer())
      .get(
        '/api/v1/appointments?patientId=p-99&include=patient&fields[patients]=fullName,dni,email,phone,address',
      )
      .expect(200)
      .expect(({ body }) => {
        const serialized = JSON.stringify(body);
        expect(serialized).toContain('juan@example.com');
        expect(serialized).toContain('999111222');
        expect(serialized).toContain('Av. Demo 123');
      });
  });

  it('rejects invalid query combinations and projection keys', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/appointments?date=2026-05-15&from=2026-05-01&to=2026-05-31')
      .expect(400);
    await request(app.getHttpServer())
      .get('/api/v1/appointments?from=2026-05-01')
      .expect(400);
    await request(app.getHttpServer())
      .get('/api/v1/appointments?from=2026-05-31&to=2026-05-01')
      .expect(400);
    await request(app.getHttpServer())
      .get('/api/v1/appointments?include=patient,insurance')
      .expect(400);
    await request(app.getHttpServer())
      .get('/api/v1/appointments?fields[unknown]=name')
      .expect(400);
    await request(app.getHttpServer())
      .get('/api/v1/appointments?fields[patients]=fullName,unknown')
      .expect(400);
  });
});
