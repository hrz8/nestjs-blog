import { Controller, Get, Post, Body, Res, HttpStatus, Param, NotFoundException, Query, Put, BadRequestException, Delete } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { ValidateObjectId } from './pipes/validate-object-id.pipe';
import { ValidateQueryInteger } from './pipes/validate-query-integer.pipe';
import { GetResponse, GetOneResponse, ActionResponse } from '../shared/base.response';
import { BasicFilterMessage, BasicQueryMessage } from '../shared/base.message';
import { BaseModel } from './base.model';

@Controller()
export class BaseController<TModel extends BaseModel> {
  private readonly dataService: any;
  constructor(public DataService: any) {
    this.dataService = DataService;
}

  @Get('')
  public async get(@Res() res, @Query(new ValidateQueryInteger()) queryString: BasicQueryMessage): Promise<GetResponse<TModel>>
  {
    // ?limit=1&offset=10
    // &order=description:desc
    // &filter=likes:56;category:5e588991aaace037d00cc9d3;date:1582822800000-1582866000000

    let response: GetResponse<TModel> = new GetResponse<TModel>();
    let data: Array<TModel> = new Array<TModel>();
    let filterMessage: BasicFilterMessage<TModel> = new BasicFilterMessage<TModel>();
   
    if (Object.keys(queryString).length) {
      const regexColon: RegExp = /^(\w+):(\w+(?:\-\w+)?)$/;

      // &filter=field:value;field2:value
      if (queryString.filter) {
        const filters = queryString.filter.split(";");
        filters.forEach(item => {
          const filter = item.match(regexColon);
          // date:1582822800000-1582866000000
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
            // likes:56
            if (regexDecimal.test(filter[2])) {
              filterMessage.filter[filter[1]] = Number(filter[2]);
            }
            else {
              // id=5e57e5eb83775a2ec42cec29
              if (mongoose.Types.ObjectId.isValid(filter[2])) {
                filterMessage.filter[filter[1]] = filter[2];
              }
              // category:5e588991aaace037d00cc9d3;name:how
              else {
                filterMessage.filter[filter[1]] = new RegExp(filter[2], 'i');
              }
            }
          }
        });
      }

      // &order=description:desc
      if (queryString.order) {
        const order = queryString.order.match(regexColon);
        filterMessage.sort[order[1]] = order[2];
      }

      // &limit=1&offset=10
      filterMessage.limit = queryString.limit;
      filterMessage.offset = queryString.offset;
    }

    try {
      data = await this.dataService.findAsync(filterMessage);
    }
    catch {
      data = await this.dataService.findAsync(new BasicFilterMessage<TModel>());
    }

    response.message = "successfully fetched";
    response.total = data.length;
    response.data = data;

    return res.status(HttpStatus.OK).json(response);
  }
  
  @Get(':id')
  public async getById(@Res() res, @Param('id', new ValidateObjectId()) id): Promise<TModel>
  {
    let response: GetOneResponse<TModel> = new GetOneResponse<TModel>();
    const data: TModel = await this.dataService.findByIdAsync(id);

    if (!data) {
      throw new NotFoundException("unknown id");
    }

    response.message = "successfully fetched";
    response.id = data.id;
    response.data = data;

    return res.status(HttpStatus.OK).json(response);
  }

  @Post('')
  public async create(@Res() res, @Body() message: TModel): Promise<TModel>
  {
    let response: ActionResponse<TModel> = new ActionResponse<TModel>();
    const newData: TModel = await this.dataService.createAsync(message);

    response.message = "successfully created";
    response.action = "create";
    response.id = newData.id;
    response.data = newData;

    return res.status(HttpStatus.OK).json(response);
  }

  @Put(':id')
  public async update(@Res() res, @Param('id', new ValidateObjectId()) id, @Body() message: TModel): Promise<TModel>
  {
    if (!id || !message.id) {
      throw new NotFoundException("id required");
    }

    if (id !== message.id) {
      throw new BadRequestException("invalid id match");
    }

    let response: ActionResponse<TModel> = new ActionResponse<TModel>();
    const editData: TModel = await this.dataService.updateAsync(message);

    if (!editData) {
        throw new NotFoundException('unknown id');
    }

    response.message = "successfully updated";
    response.action = "update";
    response.id = editData.id;
    response.data = editData;

    return res.status(HttpStatus.OK).json(response);
  }

  @Delete(':id')
  public async delete(@Res() res, @Param('id', new ValidateObjectId()) id): Promise<TModel>
  {
    let response: ActionResponse<TModel> = new ActionResponse<TModel>();
    const deleteData: TModel = await this.dataService.deleteByIdAsync(id);

    response.message = "successfully deleted";
    response.action = "delete";
    response.id = deleteData.id;
    response.data = deleteData;

    return res.status(HttpStatus.OK).json(response);
  }
}
