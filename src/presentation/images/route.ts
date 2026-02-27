import { Router } from "express";
import { ImageController } from "./controller";

export class ImageRoute {
  constructor() {}

  static get route(): Router {
    const router = Router();

    const controller = new ImageController();
    router.get("/:type/:img", controller.getImage);
    return router;
  }
}
