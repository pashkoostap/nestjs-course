import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { TypegooseModule } from '@m8a/nestjs-typegoose';
import { ReviewModel } from './review.model';
import { ReviewService } from './review.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: ReviewModel,
        discriminators: [
          {
            typegooseClass: ReviewModel,
            discriminatorId: 'ReviewModel',
          },
        ],
        schemaOptions: {
          collection: 'Review',
        },
      },
    ]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
