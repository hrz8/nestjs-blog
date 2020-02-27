export class BaseResponse<T> {
  public statusCode: number = 200;
  public error: any = null;
  public message: string = 'ok';
  public data: Array<T>;
  public total: number = 0;
}