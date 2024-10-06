import { ObjectId } from "mongoose";

export interface IBaseEntity {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
