import { bcryptAadapter, envs } from "../../config";
import { JwtGenerator } from "../../config/jwt";
import { UserModel } from "../../data";
import { RegisterUserDto } from "../dtos/auth/auth-dto";
import { LoginUserDto } from "../dtos/auth/login-dto";
import { UserEntity } from "../entities/user-entity";
import { CustomError } from "../errors";
import { EmailService } from "./email-service";

export class AuthService {
  constructor(private readonly emailService: EmailService) {}
  async registerUser(registerDto: RegisterUserDto) {
    const existingEmail = await UserModel.findOne({ email: registerDto.email });
    if (existingEmail) {
      CustomError.badRequest("Email already in use");
    }

    try {
      // create user
      const user = new UserModel(registerDto);
      user.password = bcryptAadapter.hash(registerDto.password);
      await user.save();

      // send email
      await this.sendEmailValidationLink(user.email);

      const userEntity = UserEntity.fromObject(user);

      const { password, ...rest } = userEntity;

      const token = await JwtGenerator.jwtLogin({ id: user?.id });
      if (!token) {
        CustomError.internalError("Error creating token");
      }

      return { user: rest, token: token };
    } catch (error) {
      console.log(error);
      return CustomError.internalError("Error creating user");
    }
  }

  async loginUser(loginDto: LoginUserDto) {
    const user = await UserModel.findOne({ email: loginDto.email });
    if (!user) {
      CustomError.badRequest("user not found");
    }

    const hasMatch = bcryptAadapter.compare(user!.password, loginDto.password);
    if (!hasMatch) {
      CustomError.badRequest("Invalid credentials");
    }

    try {
      const { password, ...rest } = UserEntity.fromObject(user!);

      const token = await JwtGenerator.jwtLogin({
        id: user?.id,
        email: user?.email,
      });
      if (!token) {
        CustomError.internalError("Error creating token");
      }

      return { user: rest, token };
    } catch (error) {
      console.log(error);
      return CustomError.internalError("Error creating user");
    }
  }

  private async sendEmailValidationLink(email: string) {
    const token = await JwtGenerator.jwtLogin({ email });
    if (!token) {
      CustomError.internalError("Error creating token");
    }

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

    const html = `
    <h1>Validate your email</h1>
    <p>Click on the following link to validate your email</p>
    <a href=${link}>Validate your email: ${email}</a>
    `;

    const options = {
      to: email,
      subject: "Validate your email",
      htmlBody: html,
    };

    const sent = await this.emailService.sendEmail(options);
    if (!sent) {
      CustomError.internalError("Error sending email");
    }

    return true;
  }

  public validateToken = async (token: string) => {
    const payload = await JwtGenerator.jwtValidate(token);
    if (!payload) {
      CustomError.unAuthorized("Invalid token");
    }

    const { email } = payload as { email: string };
    if (!email) {
      CustomError.internalError("Email not in token payload");
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw CustomError.internalError("User not found");
    }

    user.emailValidated = true;
    await user.save();
  };
}
