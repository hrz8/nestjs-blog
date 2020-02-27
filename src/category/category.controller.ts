import { Controller, Get, Post, Body } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './category.model';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('get')
  public async get(): Promise<Category[] | null> {
    return await this.categoryService.findAllAsync();
  }

  @Post('create')
  public async create(@Body() newCategory: Category): Promise<Category> {
    return await this.categoryService.createAsync(newCategory);
  }
}
