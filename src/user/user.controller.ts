import { Controller } from '@nestjs/common';
import { BaseController } from '../shared/base.controller';
import { UserService } from './user.service';
import { User } from './user.model';

@Controller('user')
export class UserController extends BaseController<User> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
}
