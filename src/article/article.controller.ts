import { Controller, Get, Post, Body, Res, HttpStatus, Param, NotFoundException, Query, BadRequestException } from '@nestjs/common';
import { PostService } from './article.service';
import { Article } from './article.model';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipe';
import { GetResponse } from '../shared/base.response';
import { BaseMessage } from '../shared/base.message';
import { ValidateQueryInteger } from 'src/shared/pipes/validate-query-integer.pipe';

@Controller('article')
export class ArticleController {

  constructor(private readonly articleService: PostService) {}

  @Get('get')
  public async get(
    @Res() res,
    @Query(new ValidateQueryInteger()) query: BaseMessage
  ): Promise<GetResponse<Article>> {
    let response: GetResponse<Article> = new GetResponse<Article>();
    let data: Array<Article> = new Array<Article>();
    let sort = {}, limit: number, offset: number;
    if (Object.keys(query).length) {
      // if (!query.hasOwnProperty('orderBy') ||
      //     !query.hasOwnProperty('orderAs') ||
      //     !query.hasOwnProperty('offset') ||
      //     !query.hasOwnProperty('limit')
      // ) {
      //   console.log(query)
      //   throw new BadRequestException("invalid message key");
      // }
      try {
        if (query.orderBy && query.orderAs) {
          sort[query.orderBy] = query.orderAs;
        }
        limit = query.limit || 0;
        offset = query.offset || 0;
        console.log(sort, typeof limit)
        data = await this.articleService.findAllAsync({}, sort, offset, limit);
        response.data = data;
      }
      catch {
        throw new BadRequestException("invalid message value");
      }
    }
    else {
      data = await this.articleService.findAllAsync();
      response.data = data;
    }
    response.message = "successfully fetched";
    response.total = data.length;
    return res.status(HttpStatus.OK).json(response);
  }
  
  @Get('get/:id')
  public async getById(
      @Res() res,
      @Param('id', new ValidateObjectId()) id
    ): Promise<Article> {
    const data = await this.articleService.findByIdAsync(id);
    if (!data) {
      throw new NotFoundException();
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

