import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './test-server/app.module';
import request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 1000);

  afterAll(() => app.close());

  it('/ (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/?url=https://nestjs.com')
      .expect(200);

    expect(body).toEqual({ title: 'NestJS - A progressive Node.js framework' });
  }, 30000);

  it('/context (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/context')
      .expect(200);
    expect(body).toHaveProperty('incognito', false);
  });

  it('/crawler (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/crawler?url=https://nestjs.com')
      .expect(200);

    expect(body).toEqual({ title: 'NestJS - A progressive Node.js framework' });
  }, 30000);

  it('/crawler/context (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/crawler/context')
      .expect(200);
    expect(body).toHaveProperty('incognito', true);
  });
});
