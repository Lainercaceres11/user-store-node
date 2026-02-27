import { Request, Response } from "express";
import { CustomError } from "../../domain/errors";
import { UploadedFile } from "express-fileupload";
import { UploadFileService } from "../../domain/services/upload-file-service";

export class UploadController {
  constructor(public readonly uploadedService: UploadFileService) {}
  private handleError(error: unknown, response: Response) {
    if (error instanceof CustomError) {
      return response.status(error.statusCode).send({ message: error.message });
    }

    return response.status(500).send({ message: "Internal server error" });
  }

  uploadFile = (req: Request, res: Response) => {
    const type = req.params.type;

    const file = req.body.files.at(0) as UploadedFile;

    this.uploadedService
      .uploadSingle(file, `uploads/${type}`)
      .then((uploaded) => res.status(200).json(uploaded))
      .catch((error) => this.handleError(error, res));
  };

  uploadMultipleFile = (req: Request, res: Response) => {
    const type = req.params.type;

    const files = req.body.files as UploadedFile[];

    this.uploadedService
      .uploadMultiple(files, `uploads/${type}`)
      .then((uploaded) => res.status(200).json(uploaded))
      .catch((error) => this.handleError(error, res));
  };
}
