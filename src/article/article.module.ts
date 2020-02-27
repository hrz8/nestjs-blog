import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ArticleController } from './article.controller';
import { Article } from './article.model';
import { PostService } from './article.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      { typegooseClass: Article, schemaOptions: Article.schema },
    ]),
  ],
  providers: [PostService],
  controllers: [ArticleController],
})
export class ArticleModule {}
