import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

interface HealthResponse {
  status: string;
  timestamp: string;
}

describe('HealthController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        const body = res.body as HealthResponse;

        expect(body.status).toBe('ok');
        expect(body.timestamp).toBeDefined();
      });
  });

  it('/auth/me (GET) requires an access token', () => {
    return request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  it('/auth/google (GET) starts OAuth with a state cookie', () => {
    return request(app.getHttpServer())
      .get('/auth/google')
      .expect(302)
      .expect('location', /accounts\.google\.com/)
      .expect('set-cookie', /googleOAuthState=/);
  });

  it('/auth/refresh (POST) requires a refresh cookie', () => {
    return request(app.getHttpServer()).post('/auth/refresh').expect(401);
  });

  it('/auth/logout (POST) clears the refresh cookie', () => {
    return request(app.getHttpServer())
      .post('/auth/logout')
      .expect(200)
      .expect('set-cookie', /refreshToken=;/)
      .expect({ success: true });
  });

  afterEach(async () => {
    await app.close();
  });
});
