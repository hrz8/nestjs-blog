import { Controller, Get, Post, Body, Res, HttpStatus, Param, NotFoundException } from '@nestjs/common';
import { PostService } from './article.service';
import { Article } from './article.model';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipe';
import { BaseResponse } from '../shared/base.response';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: PostService) {}

  @Get('get')
  public async get(@Res() res): Promise<Article[] | null> {
    const data = await this.articleService.findAllAsync();
    // const response = new BaseResponse {
    //   data: data
    // }
    return res.status(HttpStatus.OK).json({
      error: null,
      message: 'ok',
      statusCode: HttpStatus.OK,
      total: data.length,
      data: data
    });
  }
  
  @Get('get/:id')
  public async getOne(
      @Res() res,
      @Param('id', new ValidateObjectId()) id
    ): Promise<Article> {
    const data = await this.articleService.findByIdAsync(id);
    if (!data) {
      throw new NotFoundException("fail");
    }
    return res.status(HttpStatus.OK).json({
      error: null,
      message: 'ok',
      statusCode: HttpStatus.OK,
      data: data
    });
  }

  @Post('create')
  public async create(@Res() res, @Body() message: Article): Promise<Article> {
    const newData = await this.articleService.createAsync(message);
    return res.status(HttpStatus.OK).json({
      error: null,
      message: 'ok',
      statusCode: HttpStatus.OK,
      data: newData
    });
  }
}
