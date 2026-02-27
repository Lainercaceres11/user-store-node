import { Router } from "express";

import { envs } from "../../config";
import { AuthController } from "./controller";
import { EmailService, AuthService } from "../../domain/services";

export class AuthRouter {
  static get route(): Router {
    const router = Router();
    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL,
    );
    const authService = new AuthService(emailService);
    const controller = new AuthController(authService);

    router.post("/login", controller.loginUser);
    router.post("/register", controller.registerUser);
    router.get("/validate-email/:token", controller.validateEmail);

    return router;
  }
}
