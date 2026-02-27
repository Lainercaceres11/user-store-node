import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  avaliable: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  description: { type: String },

  //relations
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
});

productSchema.virtual("id").get(function () {
  return this._id.toString();
});
productSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, { _id, __v, ...rest }) => ({ ...rest }),
});

export const ProductModel = mongoose.model("Product", productSchema);
