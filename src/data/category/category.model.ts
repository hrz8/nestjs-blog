import { prop } from '@typegoose/typegoose';
import { IsString } from 'class-validator';
import { BaseModel } from '../../shared/base.model';
 
export class Category extends BaseModel {
  @IsString()
  @prop({ required: true })
  public name!: string;
}
