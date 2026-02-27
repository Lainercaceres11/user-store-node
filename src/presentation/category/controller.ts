import { Request, Response } from "express";
import { CustomError } from "../../domain/errors";
import { CreateCategoryDto } from "../../domain/dtos/category";
import { CategoryService } from "../../domain/services/category-service";
import { PaginationDto } from "../../domain/dtos/shared/pagination-dto";

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  private handleError(error: unknown, response: Response) {
    if (error instanceof CustomError) {
      return response.status(error.statusCode).send({ message: error.message });
    }

    return response.status(500).send({ message: "Internal server error" });
  }

  createCategory = (req: Request, res: Response) => {
    const [error, createCategory] = CreateCategoryDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.categoryService
      .createCategory(createCategory!, req.body.user)
      .then((category) => res.status(201).json(category))
      .catch((error) => this.handleError(error, res));
  };

  getCategories = (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(
      Number(page),
      Number(limit),
    );
    if (error) return res.status(400).json({ error });
    this.categoryService
      .getCategories(paginationDto!)
      .then((categories) => res.json(categories))
      .catch((error) => this.handleError(error, res));
  };
}
