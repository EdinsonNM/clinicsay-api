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
  });
});
