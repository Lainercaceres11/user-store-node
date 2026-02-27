import { NextFunction, Request, Response } from "express";

export class CheckFilesMiddleware {
  static checkFiles(validTypes: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const type = req.params.type;
      if (!validTypes.includes(type))
        return res.status(400).json({ message: "Invalid type" });

      next();
    };
  }
}
