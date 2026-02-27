import { Router } from "express";
import { ProductController } from "./controller";
import { ProductService } from "../../domain/services";
import { AuthMiddleware } from "../middlewares/auth-middleware";

export class ProductRoute {
  static get route(): Router {
    const router = Router();

    const productService = new ProductService();
    const productController = new ProductController(productService);
    router.get("", productController.getProducts);
    router.post(
      "",
      AuthMiddleware.validateJWT,
      productController.createProduct,
    );
    return router;
  }
}
