import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { envs } from "./envs";

const JWT_SECRET: Secret = envs.JWT_SECRET;

export class JwtGenerator {
  static jwtLogin(
    payload: object,
    duration: SignOptions["expiresIn"] = "2h",
  ): Promise<string | null> {
    return new Promise((resolve) => {
      jwt.sign(payload, JWT_SECRET, { expiresIn: duration }, (error, token) => {
        if (error || !token) return resolve(null);
        resolve(token);
      });
    });
  }

  static async jwtValidate<T>(token: string): Promise<T | null> {
    return new Promise((resolve) => {
      jwt.verify(token, JWT_SECRET, (error, decoded) => {
        if (error) return resolve(null);
        resolve(decoded as T);
      });
    });
  }
}
