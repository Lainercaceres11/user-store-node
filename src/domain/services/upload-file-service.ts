import { UploadedFile } from "express-fileupload";
import fs from "fs";
import path from "path";
import { uuidV4 } from "../../config/uuid";

export class UploadFileService {
  // constructor(public readonly uuid = uuidV4()) {}

  private checkFolder(folder: string) {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
  }

  async uploadSingle(
    file: UploadedFile,
    folder: string = "uploads",
    validators: string[] = ["png", "jpg", "jpeg", "gif"],
  ) {
    try {
      const fileExtension = file.mimetype.split("/").at(1) ?? "";

      if (!validators.includes(fileExtension)) {
        throw new Error(
          `Invalid file extension, must be ${validators.join(", ")}`,
        );
      }
      const destination = path.resolve(__dirname + `../../../`, folder);

      this.checkFolder(destination);

      const fileName = `${uuidV4()}.${fileExtension}`;
      await file.mv(`${destination}/${fileName}`);

      return { fileName };
    } catch (error) {
      throw error;
    }
  }

  async uploadMultiple(
    files: UploadedFile[],
    folder: string = "uploads",
    validators: string[] = ["png", "jpg", "jpeg", "gif"],
  ) {
    const filesName = await Promise.all(
      files.map((file) => this.uploadSingle(file, folder, validators)),
    );

    return filesName;
  }
}
