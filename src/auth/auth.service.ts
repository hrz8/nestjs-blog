import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { BasicFilterMessage } from '../shared/base.message';
import { User } from '../user/user.model';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  public async validateUser(username: string, pass: string): Promise<User | null>
  {
    let filterMessage: BasicFilterMessage<User> = new BasicFilterMessage<User>();
    filterMessage.filter.username = username;
    const user: User = await this.userService.findOneAsync(filterMessage)
    if (user && user.password === pass) {
      return user;
    }
    return null;
  }
}
