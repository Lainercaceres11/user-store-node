import { NextFunction, Request, Response } from "express";
import { JwtGenerator } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain/entities/user-entity";

export class AuthMiddleware {
  static async validateJWT(
    req: Request,
    response: Response,
    next: NextFunction,
  ) {
    const { authorization } = req.headers;
    if (!authorization)
      return response.status(401).json({ message: "Unauthorized" });
    if (!authorization.startsWith("Bearer "))
      return response.status(401).json({ message: "Bearer token invalid" });

    const token = authorization.split(" ").at(1) || "";

    try {
      const payload = await JwtGenerator.jwtValidate<{ id: string }>(token);
      if (!payload)
        return response.status(401).json({ message: "Invalid token" });

      const user = await UserModel.findById(payload.id);
      if (!user)
        return response.status(401).json({ message: "Invalid token-user" });
      req.body.user = user._id.toString();

      next();
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: "Internal server error" });
    }
  }
}
