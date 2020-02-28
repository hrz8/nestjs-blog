import { prop, Ref, arrayProp } from '@typegoose/typegoose';
import { IsString, IsNumber } from 'class-validator';
import { Category } from '../category/category.model';
import { BaseModel } from '../shared/base.model';

enum Reaction {
  LIKE,
  DISLIKE
}

class Comment {
  @IsString()
  @prop({ required: true })
  public message!: string;

  @prop({ required: true, enum: Reaction })
  public reaction!: string;
}

export class Article extends BaseModel {
  @IsString()
  @prop({ required: true })
  public title!: string;

  @IsString()
  @prop()
  public description?: string;

  @IsString()
  @prop({ required: true })
  public body!: string;
  
  @IsNumber()
  @prop({ default: 0 })
  public likes: number;

  @prop({ required: true, ref: Category })
  public category?: Ref<Category>;

  @prop()
  public comments?: Array<Comment>;
}
