import mongoose from "mongoose";

interface Option {
  dbName: string;
  dbUrl: string;
}

export class MongoConnection {
  static connectionDatabase = async (options: Option) => {
    const { dbName, dbUrl } = options;

    try {
      await mongoose.connect(dbUrl, {
        dbName,
      });

      console.log("connected database");
    } catch (error) {
      console.log("Error database connection", error);
      throw error;
    }
  };

  static disconnectDatabase = async () => {
    await mongoose.disconnect();
  };
}
