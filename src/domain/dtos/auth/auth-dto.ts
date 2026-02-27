import { regularExps } from "../../../config";

export class RegisterUserDto {
  constructor(
    public name: string,
    public email: string,
    public password: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const { name, email, password } = object;
    if (!name) return ["Missing name"];
    if (!email) return ["Missing email"];
    if (regularExps.email.test(email) === false) return ["Invalid email"];
    if (!password) return ["Missing password"];
    if (password.length < 6) return ["Password must be at least 6 characters"];

    return [undefined, new RegisterUserDto(name, email, password)];
  }
}
