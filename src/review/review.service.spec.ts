import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { getModelToken } from '@m8a/nestjs-typegoose';
import { Types } from 'mongoose';

describe('ReviewService', () => {
  let service: ReviewService;
  const execObj = {
    exec: jest.fn(),
  };

  function reviewRepositoryFactory() {
    return {
      find: () => execObj,
    };
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          useFactory: reviewRepositoryFactory,
          provide: getModelToken('ReviewModel'),
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  it('findByProductId', async () => {
    const productId = new Types.ObjectId().toHexString();

    reviewRepositoryFactory().find().exec.mockReturnValueOnce([{ productId }]);

    const res = await service.findByProductId(productId);

    expect(res[0].productId).toEqual(productId);
  });
});
