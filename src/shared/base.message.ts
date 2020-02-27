export class BaseMessage {
  public orderBy?: string;
  public orderAs?: string;
  public offset?: number = 0;
  public limit?: number = 0;
}