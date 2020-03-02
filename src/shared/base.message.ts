class BaseMessage {
  public offset?: number = 0;
  public limit?: number = 0;
}

export class BasicQueryMessage extends BaseMessage {
  public filter?: string;
  public sort?: string;
  public populate?: string;
}

export class BasicFilterMessage<T> extends BaseMessage {
  public filter?: T = {} as T;
  public sort?: any = {};
  public populate?: string = '';
}
