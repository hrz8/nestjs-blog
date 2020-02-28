import { Controller, Get, Post, Body, Res, HttpStatus, Param, NotFoundException, Query, BadRequestException } from '@nestjs/common';
import { PostService } from './article.service';
import { Article } from './article.model';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipe';
import { GetResponse } from '../shared/base.response';
import { BasicFilterMessage, BasicQueryMessage } from '../shared/base.message';
import { ValidateQueryInteger } from 'src/shared/pipes/validate-query-integer.pipe';

@Controller('article')
export class ArticleController {

  constructor(private readonly articleService: PostService) {}

  @Get('get')
  public async get(@Res() res, @Query(new ValidateQueryInteger()) queryString: BasicQueryMessage): Promise<GetResponse<Article>>
  {
    let response: GetResponse<Article> = new GetResponse<Article>();
    let data: Array<Article> = new Array<Article>();
    let filterMessage: BasicFilterMessage<Article> = new BasicFilterMessage<Article>();

    if (Object.keys(queryString).length) {

      if (queryString.filter) {
        const filters = queryString.filter.split(";");
        filterMessage.filter = {} as Article;
        filters.forEach(item => {
          const regexComma: RegExp = /^(\w+),(\w+)$/;
          const filter = item.match(regexComma);
          filterMessage.filter[filter[1]] = new RegExp(filter[2], 'i');
        });
      }

      if (queryString.order) {
        const regexComma: RegExp = /^(\w+),(\w+)$/;
        const order = queryString.order.match(regexComma);
        filterMessage.sort[order[1]] = order[2];
      }

      filterMessage.limit = queryString.limit;
      filterMessage.offset = queryString.offset;
    }

    try {
      data = await this.articleService.findAsync(filterMessage);
    }
    catch {
      throw new BadRequestException("invalid message");
    }

    response.message = "successfully fetched";
    response.total = data.length;
    response.data = data;

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

