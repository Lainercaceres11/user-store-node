import { Router } from "express";
import { UploadController } from "./controller";
import { UploadFileService } from "../../domain/services/upload-file-service";
import { UploadFileMiddleware } from "../middlewares/upload-file-middleware";
import { CheckFilesMiddleware } from "../middlewares/type-middlware";

export class UploadRouter {
  static get route(): Router {
    const router = Router();

    router.use(UploadFileMiddleware.containsFiles);
    const uploadController = new UploadController(new UploadFileService());
    router.post("/multiple/:type", uploadController.uploadMultipleFile);
    router.post(
      "/single/:type",
      [CheckFilesMiddleware.checkFiles(["products", "categories", "users"])],
      uploadController.uploadFile,
    );
    return router;
  }
}
