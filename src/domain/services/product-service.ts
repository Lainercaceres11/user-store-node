import { ProductModel } from "../../data";
import { CreateProductDto } from "../dtos";
import { PaginationDto } from "../dtos/shared/pagination-dto";
import { CustomError } from "../errors";

export class ProductService {
  constructor() {}

  createProduct = async (productDto: CreateProductDto) => {
    const productExist = await ProductModel.findOne({
      name: productDto.name,
    });

    if (productExist) throw CustomError.badRequest("Product already exist");

    try {
      const product = new ProductModel({ ...productDto });
      await product.save();

      return product;
    } catch (error) {
      console.log(error);
      throw CustomError.internalError("Error creating product");
    }
  };

  getProducts = async (paginationDto: PaginationDto) => {
    const { page, limit } = paginationDto;
    try {
      const [count, products] = await Promise.all([
        ProductModel.countDocuments(),
        ProductModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate("user", "name email"),
      ]);

      return {
        page,
        limit,
        total: count,
        products: products,
      };
    } catch (error) {
      throw CustomError.internalError("Error getting products");
    }
  };
}
