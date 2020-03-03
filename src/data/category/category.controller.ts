import { Controller } from '@nestjs/common';
import { BaseController } from '../../shared/base.controller';
import { CategoryService } from './category.service';
import { Category } from './category.model';

@Controller('category')
export class CategoryController extends BaseController<Category> {
  constructor(private readonly categoryService: CategoryService) {
    super(categoryService);
  }
}
