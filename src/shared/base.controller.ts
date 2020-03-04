import {
  Controller, 
  Get, Post, Body, Res, Query, Put, Delete, Param,
  HttpStatus, NotFoundException,  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import * as mongoose from 'mongoose';
import { ValidateObjectId } from './pipes/validate-object-id.pipe';
import { ValidateQueryInteger } from './pipes/validate-query-integer.pipe';
import { GetResponse, GetOneResponse, ActionResponse } from '../shared/base.response';
import { BasicFilterMessage, BasicQueryMessage } from '../shared/base.message';
import { BaseModel } from './base.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class BaseController<TModel extends BaseModel> {
  private readonly dataService: any;
  constructor(public DataService: any)
  {
    this.dataService = DataService;
  }

  @Get()
  public async get(@Res() res, @Query(new ValidateQueryInteger()) queryString: BasicQueryMessage): Promise<GetResponse<TModel>>
  {
    let response: GetResponse<TModel> = new GetResponse<TModel>();
    let data: Array<TModel> = new Array<TModel>();
    let filterMessage: BasicFilterMessage<TModel> = new BasicFilterMessage<TModel>();
   
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
                if (filter[1] !== '_id') {
                  filterMessage.filter[filter[1]] = filter[2];
                }
              }
              else {
                filterMessage.filter[filter[1]] = new RegExp(filter[2], 'i');
              }
            }
          }
        });
      }

      if (queryString.sort) {
        const order = queryString.sort.match(regexColon);
        filterMessage.sort[order[1]] = order[2];
      }

      if (queryString.populate) {
        const regexComma: RegExp = /^(\w+)(,(\w+))?$/;
        if (regexComma.test(queryString.populate)) {
          filterMessage.populate = queryString.populate.replace(/,/g, ' ');
        }
      }

      filterMessage.limit = queryString.limit;
      filterMessage.offset = queryString.offset;
    }

    try {
      data = await this.dataService.findAsync(filterMessage);
    }
    catch {
      data = await this.dataService.findAsync(new BasicFilterMessage<TModel>());
    }

    response.message = data.length ? "successfully fetched" : "data is empty";
    response.total = data.length;
    response.data = data;

    return res.status(HttpStatus.OK).json(response);
  }
  
  @Get(':id')
  public async getById(@Res() res, @Param('id', new ValidateObjectId()) id): Promise<GetOneResponse<TModel>>
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

  @Post()
  public async create(@Res() res, @Body() message: TModel): Promise<ActionResponse<any>>
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
  public async update(@Res() res, @Param('id', new ValidateObjectId()) id, @Body() message: TModel): Promise<ActionResponse<TModel>>
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
  public async delete(@Res() res, @Param('id', new ValidateObjectId()) id): Promise<ActionResponse<TModel>>
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
