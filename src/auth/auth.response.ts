import { BaseResponse } from '../shared/base.response';

export class LoginResponse extends BaseResponse {
  public access_token: string;
}
