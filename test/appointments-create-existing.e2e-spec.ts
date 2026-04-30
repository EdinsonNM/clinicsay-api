import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Create appointment existing patient (e2e)', () => {
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

  it('creates appointment with existing patient', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/appointments')
      .send({
        date: '2026-05-21T10:00:00.000Z',
        doctorId: 'd-44',
        specialtyId: 's-1',
        patientId: 'p-99',
        reason: 'Consulta',
      })
      .expect(201);
  });

  it('rejects invalid doctor-specialty combination', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/appointments')
      .send({
        date: '2026-05-21T10:00:00.000Z',
        doctorId: 'd-44',
        specialtyId: 's-2',
        patientId: 'p-99',
      })
      .expect(400);
  });
});
