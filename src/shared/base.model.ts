import { prop } from "@typegoose/typegoose";

export abstract class BaseModel {
  public createdAt?: any;

  public updatedAt?: any; 
  public id?: string;

  public static get schema(): any {
    return {
      timestamps: true,
      toJSON: {
        getters: true,
        virtuals: true,
      },
    };
  }

  public static get modelName(): string {
    return this.name;
  }

  public static get attributeNames(): any {
    return Object.keys(this.prototype);
  }
}