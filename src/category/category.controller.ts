import { Controller } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.model';
import { BaseController } from '../shared/base.controller';

@Controller('category')
export class CategoryController extends BaseController<Category> {
  constructor(private readonly categoryService: CategoryService) {
    super(categoryService);
  }
}
