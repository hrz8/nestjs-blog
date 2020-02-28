import { Controller, Get, Post, Body, Res, HttpStatus, Param, NotFoundException, Query, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { ArticleService } from './article.service';
import { Article } from './article.model';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipe';
import { GetResponse, GetOneResponse, ActionResponse } from '../shared/base.response';
import { BasicFilterMessage, BasicQueryMessage } from '../shared/base.message';
import { ValidateQueryInteger } from 'src/shared/pipes/validate-query-integer.pipe';

@Controller('article')
export class ArticleController {

  constructor(private readonly articleService: ArticleService) {}

  @Get('')
  public async get(@Res() res, @Query(new ValidateQueryInteger()) queryString: BasicQueryMessage): Promise<GetResponse<Article>>
  {
    // ?limit=1
    // &sort=description:desc
    // &filter=likes:56;category:5e588991aaace037d00cc9d3;date:1582822800000-1582866000000

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
            const startDate = Number(rangeDate[0]);
            const endDate = Number(rangeDate[1]);
            filterMessage.filter.createdAt = {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
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
      data = await this.articleService.findAsync(new BasicFilterMessage<Article>());
    }

    response.message = "successfully fetched";
    response.total = data.length;
    response.data = data;

    return res.status(HttpStatus.OK).json(response);
  }
  
  @Get(':id')
  public async getById(@Res() res, @Param('id', new ValidateObjectId()) id): Promise<Article>
  {
    let response: GetOneResponse<Article> = new GetOneResponse<Article>();
    let data: Article = await this.articleService.findByIdAsync(id);

    if (!data) {
      throw new NotFoundException("unknown id");
    }

    response.message = "successfully fetched";
    response.id = data.id;
    response.data = data;

    return res.status(HttpStatus.OK).json(response);
  }

  @Post('create')
  public async create(@Res() res, @Body() message: Article): Promise<Article>
  {
    let response: ActionResponse<Article> = new ActionResponse<Article>();
    const newData: Article = await this.articleService.createAsync(message);

    response.message = "successfully created";
    response.action = "create";
    response.id = newData.id;
    response.data = newData;

    return res.status(HttpStatus.OK).json(response);
  }
}
