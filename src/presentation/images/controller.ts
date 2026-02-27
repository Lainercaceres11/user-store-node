import { Request, Response } from "express";
import path from "path";
import fs from "fs";

export class ImageController {
  constructor() {}

  getImage = (req: Request, res: Response) => {
    const { type = "", img = "" } = req.params;

    const imageUrl = path.resolve(
      __dirname,
      "../../../",
      `uploads/${type}/${img}`,
    );

    if (!fs.existsSync(imageUrl))
      return res.status(404).json({ message: "Image not found" });
    res.sendFile(imageUrl);
  };
}
