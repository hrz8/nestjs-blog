import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class ValidateQueryInteger implements PipeTransform<string> {
  public async transform(value): Promise<number> {
    if (!isNaN(value)) {
        return parseInt(value);
    }
    return value;
  }
}
