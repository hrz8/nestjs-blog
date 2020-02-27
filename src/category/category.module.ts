import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { CategoryController } from './category.controller';
import { Category } from './category.model';
import { CategoryService } from './category.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      { typegooseClass: Category, schemaOptions: Category.schema },
    ]),
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
