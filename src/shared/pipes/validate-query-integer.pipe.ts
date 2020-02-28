import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class ValidateQueryInteger implements PipeTransform<string> {
  public async transform(value): Promise<number> {
    const keys = Object.keys(value);
    keys.forEach(key => {
      if (!isNaN(value[key])) {
        value[key] = parseInt(value[key]);
      }
    });
    return value;
  }
}
