import mongoose from "mongoose";

export class Validators {
  static validate(id: string) {
    return mongoose.isValidObjectId(id);
  }
}
