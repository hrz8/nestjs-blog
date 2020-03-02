import { Controller } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.model';
import { BaseController } from '../shared/base.controller';

@Controller('article')
export class ArticleController extends BaseController<Article> {

  constructor(private readonly articleService: ArticleService) {
    super(articleService);
  }
}
