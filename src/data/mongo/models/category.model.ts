import mongoose, { Schema } from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"], uniqued: true },
  avaliable: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

categorySchema.virtual("id").get(function () {
  return this._id.toString();
});
categorySchema.set("toJSON", {
  virtuals: true,
  transform: (doc, { _id, __v, ...rest }) => ({ ...rest }),
});

export const CategoryModel = mongoose.model("Category", categorySchema);
