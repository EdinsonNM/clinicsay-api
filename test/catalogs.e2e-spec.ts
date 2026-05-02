import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

type SpecialtiesResponse = {
  data: Array<{ id: string }>;
};

describe('Catalogs (e2e)', () => {
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

  it('searches patients and lists specialties/doctors', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/patients?search=Juan')
      .expect(200);
    const specialties = await request(app.getHttpServer())
      .get('/api/v1/specialties')
      .expect(200);
    const specialtiesBody = specialties.body as SpecialtiesResponse;
    await request(app.getHttpServer())
      .get(`/api/v1/doctors?specialtyId=${specialtiesBody.data[0].id}`)
      .expect(200);
    await request(app.getHttpServer()).get('/api/v1/doctors').expect(200);
  });

  it('CRUD de especialidades y doctores (demo store)', async () => {
    const suffix = Date.now();
    const createdSpec = await request(app.getHttpServer())
      .post('/api/v1/specialties')
      .send({ name: `E2E Especialidad ${suffix}` })
      .expect(201);
    const specId = (createdSpec.body as { data: { id: string } }).data.id;

    await request(app.getHttpServer())
      .get(`/api/v1/specialties/${specId}`)
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/api/v1/specialties/${specId}`)
      .send({ name: `E2E Especialidad ${suffix} (editada)` })
      .expect(200);

    const cmp = `CMP-E2E-${suffix}`;
    const createdDoc = await request(app.getHttpServer())
      .post('/api/v1/doctors')
      .send({
        name: 'Dr. E2E Demo',
        cmp,
        specialtyIds: [specId],
      })
      .expect(201);
    const docBody = createdDoc.body as {
      data: { id: string; specialtyIds: string[] };
    };
    expect(docBody.data.specialtyIds).toContain(specId);

    await request(app.getHttpServer())
      .patch(`/api/v1/doctors/${docBody.data.id}`)
      .send({ name: 'Dr. E2E Demo Actualizado' })
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/api/v1/doctors/${docBody.data.id}`)
      .expect(204);

    await request(app.getHttpServer())
      .delete(`/api/v1/specialties/${specId}`)
      .expect(204);
  });
});
