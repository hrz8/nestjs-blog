import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ArticleModule } from './article/article.module';
import { CategoryModule } from './category/category.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypegooseModule.forRoot('mongodb://127.0.0.1/nestjs-blog', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }),
    ArticleModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
