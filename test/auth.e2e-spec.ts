import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

type LoginResponse = {
  token: string;
  user: { role: string };
};

describe('Auth admin dummy (e2e)', () => {
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

  it('returns admin session for valid dummy credentials', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ username: 'admin', password: 'admin' })
      .expect(201)
      .expect(({ body }) => {
        const response = body as LoginResponse;
        expect(response.token).toBe('dummy-admin-token');
        expect(response.user.role).toBe('admin');
      });
  });

  it('rejects invalid credentials', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ username: 'admin', password: 'wrong' })
      .expect(401);
  });
});
