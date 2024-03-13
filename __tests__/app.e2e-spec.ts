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
  }, 30000);

  afterAll(async () => {
    if (app) await app.close();
  });

  it('should return title of the page', async () => {
    const urls = ['https://google.com', 'https://bing.com'];
    const requests = urls.map((url) => {
      if (url.toLowerCase().includes('bing')) {
        return request(app.getHttpServer())
          .get(`/crawler/?url=${url}`)
          .expect(200);
      }
      return request(app.getHttpServer()).get(`/?url=${url}`).expect(200);
    });

    const responses = await Promise.all(requests);

    expect(responses[0].body.title).toBe('Google');
    expect(responses[1].body.title).toBe('Bing');
  });
});
