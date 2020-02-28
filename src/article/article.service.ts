import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from '@typegoose/typegoose/lib/types';
import { BaseService } from '../shared/base.service';
import { Article } from './article.model';

@Injectable()
export class ArticleService extends BaseService<Article> {
  constructor(
    @InjectModel(Article)
    private readonly articleModel: ReturnModelType<typeof Article>,
  ) {
    super(articleModel);
  }
}
