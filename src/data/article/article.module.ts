import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ArticleController } from './article.controller';
import { Article } from './article.model';
import { ArticleService } from './article.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      { typegooseClass: Article, schemaOptions: Article.schema },
    ]),
  ],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
