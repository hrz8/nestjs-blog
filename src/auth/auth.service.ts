import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { BasicFilterMessage } from '../shared/base.message';
import { User, UserSafe } from '../user/user.model';
import { LoginResponse } from './auth.response';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  public async validateUser(username: string, pass: string): Promise<UserSafe | null>
  {
    let filterMessage: BasicFilterMessage<User> = new BasicFilterMessage<User>();
    filterMessage.filter.username = username;
    const user: User = await this.userService.findOneAsync(filterMessage)
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  public async login(user: User): Promise<LoginResponse>
  {
    const response: LoginResponse = new LoginResponse();
    const { password, ...userSafe } = user;

    response.message =  "successfully loged in";
    response.access_token = this.jwtService.sign(userSafe);
    
    return response;
  }
}
