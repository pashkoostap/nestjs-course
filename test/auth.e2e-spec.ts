import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDto } from 'src/auth/auth.dto';
import {
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD_ERROR,
} from '../src/auth/auth.constants';

const authDto: AuthDto = {
  login: 'user@email.com',
  password: 'password',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - success', (done) => {
    request(app.getHttpServer())
      .post('/auth/login')
      .send(authDto)
      .expect(200)
      .expect((res: request.Response) => {
        expect(res.body.accessToken).toBeDefined();
      })
      .end(done);
  });

  it('/auth/login (POST) - fail', (done) => {
    request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...authDto, password: 'test' })
      .expect(401)
      .expect((res: request.Response) => {
        expect(res.body.message).toEqual(WRONG_PASSWORD_ERROR);
      })
      .end(done);
  });

  it('/auth/login (POST) - fail', (done) => {
    request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...authDto, login: 'login' })
      .expect(401)
      .expect((res: request.Response) => {
        expect(res.body.message).toEqual(USER_NOT_FOUND_ERROR);
      })
      .end(done);
  });

  afterAll(() => {
    disconnect();
  });
});
