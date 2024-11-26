import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from 'src/review/review.dto';
import { disconnect, Types } from 'mongoose';

const testDto: CreateReviewDto = {
  name: 'name',
  title: 'title',
  description: 'description',
  rating: 0,
  productId: new Types.ObjectId().toHexString(),
};

describe('ReviewController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/review/create (POST)', (done) => {
    request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201)
      .expect((res: request.Response) => {
        createdId = res.body._id;

        expect(createdId).toBeDefined();
      })
      .end(done);
  });

  it('/review/product/:productId (GET)', (done) => {
    request(app.getHttpServer())
      .get(`/review/product/${testDto.productId}`)
      .expect(200)
      .expect((res: request.Response) => {
        expect(res.body[0]._id).toEqual(createdId);
      })
      .end(done);
  });

  it('/review/:id (DELETE)', (done) => {
    request(app.getHttpServer())
      .delete(`/review/${createdId}`)
      .expect(200)
      .end(done);
  });

  afterAll(() => {
    disconnect();
  });
});
