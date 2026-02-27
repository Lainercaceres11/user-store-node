import { CustomError } from "../errors";

export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public emailValidated: boolean,
    public password: string,
    public role: string[],
    public img?: string,
  ) {}

  static fromObject(object: { [key: string]: any }): UserEntity {
    const { id, _id, name, email, emailValidated, password, role, img } =
      object;

    if (!_id && !id) {
      CustomError.badRequest("missign id property");
    }

    if (!name) {
      CustomError.badRequest("missign name property");
    }

    if (!email) {
      CustomError.badRequest("missign email property");
    }

    if (emailValidated === undefined) {
      CustomError.badRequest("missign emailValidated property");
    }

    if (!password) {
      CustomError.badRequest("missign password property");
    }

    if (!role) {
      CustomError.badRequest("missign role property");
    }
    return new UserEntity(
      id || _id,
      name,
      email,
      emailValidated,
      password,
      role,
      img,
    );
  }
}
