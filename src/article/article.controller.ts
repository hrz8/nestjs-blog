import { Controller, Get, Post, Body, Res, HttpStatus, Param, NotFoundException, Query } from '@nestjs/common';
import { PostService } from './article.service';
import { Article } from './article.model';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipe';
import { GetResponse } from '../shared/base.response';

@Controller('article')
export class ArticleController {

  constructor(private readonly articleService: PostService) {}

  @Get('get')
  public async get(
    @Res() res,
    @Query() query
  ): Promise<GetResponse<Article>> {
    let response: GetResponse<Article> = new GetResponse<Article>();
    let data: Array<Article> = new Array<Article>();
    if (query.orderBy != null && query.orderAs != null) {
      let sort = {};
      sort[query.orderBy] = query.orderAs;
      data = await this.articleService.findAllOrderAsync(sort);
      response.data = data;
    }
    else {
      data = await this.articleService.findAllAsync();
      response.data = data;
    }
    response.total = data.length;
    return res.status(HttpStatus.OK).json(response);
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
