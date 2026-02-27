import { Router } from "express";
import { AuthRouter } from "./auth/route";
import { CategoryRouter } from "./category/routes";
import { ProductRoute } from "./products/route";
import { UploadRouter } from "./upload/route";
import { ImageRoute } from "./images/route";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Definir las rutas
    router.use("/api/auth", AuthRouter.route);
    router.use("/api/category", CategoryRouter.route);
    router.use("/api/products", ProductRoute.route);
    router.use("/api/upload", UploadRouter.route);
    router.use("/api/images", ImageRoute.route);

    return router;
  }
}
