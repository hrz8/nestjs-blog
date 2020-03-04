import { Controller, Post, Res, Body, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { BaseController } from '../shared/base.controller';
import { UserService } from './user.service';
import { User } from './user.model';
import { ActionResponse } from '../shared/base.response';

@Controller('user')
export class UserController extends BaseController<User> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }

  @Post()
  public  async create(@Res() res, @Body() message: User): Promise<ActionResponse<User>>
  {
    let response: ActionResponse<User> = new ActionResponse<User>();

    message.password = bcrypt.hashSync(message.password, 10);
    const newData: User = await this.userService.createAsync(message);

    response.message = "successfully created";
    response.action = "create";
    response.id = newData.id;
    response.data = newData;

    return res.status(HttpStatus.OK).json(response);
  }
}
