import { CategoryModel } from "../../data";
import { CreateCategoryDto } from "../dtos/category";
import { PaginationDto } from "../dtos/shared/pagination-dto";
import { UserEntity } from "../entities/user-entity";
import { CustomError } from "../errors";

export class CategoryService {
  constructor() {}

  createCategory = async (categoryDto: CreateCategoryDto, user: UserEntity) => {
    const categoryExist = await CategoryModel.findOne({
      name: categoryDto.name,
    });

    if (categoryExist) throw CustomError.badRequest("Category already exist");

    try {
      const category = new CategoryModel({ ...categoryDto, user: user.id });
      await category.save();

      return {
        id: category.id,
        name: category.name,
        available: category.avaliable,
      };
    } catch (error) {
      console.log(error);
    }
  };

  getCategories = async (paginationDto: PaginationDto) => {
    const { page, limit } = paginationDto;
    try {
      const [count, categories] = await Promise.all([
        CategoryModel.countDocuments(),
        CategoryModel.find()
          .skip((page - 1) * limit)
          .limit(limit),
      ]);

      return {
        page,
        limit,
        total: count,
        categories: categories.map((category) => ({
          id: category.id,
          name: category.name,
          available: category.avaliable,
        })),
      };
    } catch (error) {
      throw CustomError.internalError("Error getting categories");
    }
  };
}
