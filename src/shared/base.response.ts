class BaseResponse {
  public statusCode: number = 200;
  public error: any = null;
  public message: string;
}

export class GetResponse<T> extends BaseResponse {
  public data: Array<T> = new Array<T>();
  public total: number = 0;
}

export class GetOneResponse<T> extends BaseResponse {
  public data?: T = {} as T;
  public id: string;
}

export class ActionResponse<T> extends GetOneResponse<T> {
  public action: string;
}
