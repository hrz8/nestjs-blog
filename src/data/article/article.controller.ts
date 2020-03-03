import { Controller } from '@nestjs/common';
import { BaseController } from '../../shared/base.controller';
import { ArticleService } from './article.service';
import { Article } from './article.model';

@Controller('article')
export class ArticleController extends BaseController<Article> {

  constructor(private readonly articleService: ArticleService) {
    super(articleService);
  }
}
