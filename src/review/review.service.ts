import { Injectable } from '@nestjs/common';
import { ReviewModel } from './review.model';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { CreateReviewDto } from './review.dto';
import { InjectModel as InjectTypegoose } from '@m8a/nestjs-typegoose';

import { DeleteResult } from 'mongoose';

@Injectable()
export class ReviewService {
  constructor(
    @InjectTypegoose(ReviewModel)
    private readonly reviewModel: ModelType<ReviewModel>,
  ) {}

  create(dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
    return this.reviewModel.create(dto);
  }

  delete(id: string): Promise<DocumentType<ReviewModel> | null> {
    return this.reviewModel.findByIdAndDelete(id).exec();
  }

  findByProductId(productId: string): Promise<DocumentType<ReviewModel>[]> {
    return this.reviewModel.find({ productId }).exec();
  }

  deleteByProductId(productId: string): Promise<DeleteResult> {
    return this.reviewModel.deleteMany({ productId }).exec();
  }
}
