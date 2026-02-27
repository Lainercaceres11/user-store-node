import { Request, Response } from "express";
import { AuthService } from "../../domain/services/auth-service";
import { RegisterUserDto } from "../../domain/dtos/auth/auth-dto";
import { CustomError } from "../../domain/errors";
import { LoginUserDto } from "../../domain/dtos/auth/login-dto";

export class AuthController {
  constructor(public authService: AuthService) {}

  private handleError(error: unknown, response: Response) {
    if (error instanceof CustomError) {
      return response.status(error.statusCode).send({ message: error.message });
    }

    return response.status(500).send({ message: "Internal server error" });
  }

  loginUser = (req: Request, res: Response) => {
    const [error, loginDto] = LoginUserDto.create(req.body);
    if (error) return res.status(400).send(error);
    this.authService
      .loginUser(loginDto!)
      .then((user) => res.send(user))
      .catch((error) => this.handleError(error, res));
  };

  registerUser = (req: Request, res: Response) => {
    const [error, registerDto] = RegisterUserDto.create(req.body);
    if (error) return res.status(400).send(error);
    this.authService
      .registerUser(registerDto!)
      .then((user) => res.send(user))
      .catch((error) => this.handleError(error, res));
  };

  validateEmail = (req: Request, res: Response) => {
    const { token } = req.params;
    this.authService
      .validateToken(token!)
      .then(() => res.json("Email validated"))
      .catch((error) => this.handleError(error, res));
  };
}
