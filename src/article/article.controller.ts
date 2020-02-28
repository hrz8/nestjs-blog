import { Controller, Get, Post, Body, Res, HttpStatus, Param, NotFoundException, Query, BadRequestException } from '@nestjs/common';
import * as moment from 'moment';
import * as mongoose from 'mongoose';
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
    // ?sort=description:desc&filter=likes:56;category:5e588991aaace037d00cc9d3;date:1582822800000-1582866000000
    let response: GetResponse<Article> = new GetResponse<Article>();
    let data: Array<Article> = new Array<Article>();
    let filterMessage: BasicFilterMessage<Article> = new BasicFilterMessage<Article>();

    if (Object.keys(queryString).length) {
      const regexColon: RegExp = /^(\w+):(\w+(?:\-\w+)?)$/;

      if (queryString.filter) {
        const filters = queryString.filter.split(";");
        filters.forEach(item => {
          const filter = item.match(regexColon);
          if (filter[1] === 'date') {
            const rangeDate = filter[2].split("-");
            const startDate = rangeDate[0];
            const endDate = rangeDate[1];
            filterMessage.filter.createdAt = {
              $gte: new Date(Number(startDate)),
              $lte: new Date(Number(endDate))
            }
          }
          else {
            const regexDecimal: RegExp = /^\d+$/;
            if (regexDecimal.test(filter[2])) {
              filterMessage.filter[filter[1]] = Number(filter[2]);
            }
            else {
              if (mongoose.Types.ObjectId.isValid(filter[2])) {
                filterMessage.filter[filter[1]] = filter[2];
              }
              else {
                filterMessage.filter[filter[1]] = new RegExp(filter[2], 'i');
              }
            }
          }
        });
      }

      if (queryString.order) {
        const order = queryString.order.match(regexColon);
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
