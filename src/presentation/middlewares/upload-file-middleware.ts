import { NextFunction, Request, Response } from "express";

export class UploadFileMiddleware {
  static containsFiles(req: Request, res: Response, next: NextFunction) {
    console.log("REQ.FILES:", req.files);

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files were uploaded." });
    }

    if (!Array.isArray(req.files.file)) {
      req.body.files = [req.files.file];
    } else {
      req.body.files = req.files.file;
    }

    next();
  }
}
