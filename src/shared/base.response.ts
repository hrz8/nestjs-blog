class BaseResponse {
  error: any = null;
  message: string = 'ok';
}

export class GetResponse<T> extends BaseResponse {
  data: Array<T> = new Array<T>();
  total: number = 0;
}

export class GetOneResponse<T> extends BaseResponse {
  data: T;
  id: string;
}
